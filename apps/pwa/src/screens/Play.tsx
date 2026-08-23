import {
  activeQuestion,
  canAnswer,
  canChooseCategory,
  canChooseDifficulty,
  canDraw,
  categoryById,
  DIFFICULTY_ORDER,
  DIFFICULTY_TIERS,
  discriminatingCues,
  hasSelfExplanationPrompt,
  isActingPlayer,
  isBanned,
  questionById,
  SEED_PACK,
  scoreboard,
  teamOf,
  type CategoryId,
  type SignFace,
  type Difficulty,
  type GameState,
  type TurnRecord,
} from '@kanbudong/engine';
import { Button, Card, Chip, ProgressBar } from '@heroui/react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { useApp } from '../lib/store.js';
import { ConnectionPill, Notice, Screen, StalledWarning, TierBadge, useElapsed } from '../ui/atoms.jsx';
import { withGlyphs } from '../ui/glyphs.jsx';
import {
  DecompositionPanel,
  SelfExplanationPrompt,
  useRevealDwell,
  useStage1HanziAlone,
} from '../ui/reveal.jsx';
import { Sign, templateFor } from '../ui/signs.jsx';

export function Play(): ReactNode {
  const snapshot = useApp((s) => s.snapshot);
  const identity = useApp((s) => s.identity);
  const deal = useApp((s) => s.deal);
  const pickCategory = useApp((s) => s.pickCategory);
  const bet = useApp((s) => s.bet);
  const answer = useApp((s) => s.answer);
  const callTime = useApp((s) => s.callTime);
  const error = useApp((s) => s.error);
  const dismissError = useApp((s) => s.dismissError);
  const leave = useApp((s) => s.leave);

  const state = snapshot?.state ?? null;
  if (state === null || identity === null || snapshot === null) return null;

  if (isBanned(state, identity.id)) {
    return (
      <Screen title={state.name}>
        <Notice tone="danger">
          The host removed you from this game. Whatever was in progress for your team continues
          without you; you can start or join a different one.
        </Notice>
        <Button variant="ghost" fullWidth onPress={leave}>
          Leave
        </Button>
      </Screen>
    );
  }

  const me = identity.id;
  const rows = scoreboard(state);
  const acting = rows.find((row) => row.isActing);
  const myTeam = teamOf(state, me);
  const iAmActing = isActingPlayer(state, me);
  const question = activeQuestion(state, SEED_PACK);
  const active = state.active;
  const category = active?.categoryId == null ? undefined : categoryById(active.categoryId);
  const lastTurn = state.history.at(-1) ?? null;

  return (
    <Screen
      title={acting === undefined ? state.name : `${acting.team.name} to play`}
      subtitle={
        state.suddenDeath
          ? 'Sudden death: the leaders are level and playing it out.'
          : state.endgameArmedRound !== null
            ? 'Final round: someone has crossed the line, so everyone gets an equal number of turns.'
            : `Round ${state.roundIndex + 1}, first to ${state.rules.targetScore}`
      }
      aside={
        <ConnectionPill
          status={snapshot.status}
          peerCount={snapshot.peerCount}
          everConnected={snapshot.everConnected}
        />
      }
    >
      {error !== null && (
        <Notice tone="danger">
          <div className="flex items-center justify-between gap-3">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onPress={dismissError}>
              Dismiss
            </Button>
          </div>
        </Notice>
      )}

      <StalledWarning
        status={snapshot.status}
        peerCount={snapshot.peerCount}
        everConnected={snapshot.everConnected}
        // Mid-game, a drop is urgent - no reason to wait out the same 2
        // minutes a pre-game "nobody's here yet" lobby gets.
        afterMs={15_000}
      />

      <UnexpectedPeerWarning state={state} peerCount={snapshot.peerCount} />

      <TurnAnnouncer state={state} lastTurn={lastTurn} actingTeamName={acting?.team.name ?? null} />

      <Scores state={state} me={me} />

      {active === null ? (
        <BetweenTurns
          state={state}
          me={me}
          lastTurn={lastTurn}
          onDeal={deal}
          canDealNow={canDraw(state, me)}
        />
      ) : active.categoryId === null ? (
        <ChooseCategory
          state={state}
          options={active.categoryOptions}
          canChoose={canChooseCategory(state, me)}
          onPick={pickCategory}
          onTimeout={callTime}
        />
      ) : question === null ? (
        <ChooseTier
          state={state}
          canChoose={canChooseDifficulty(state, me)}
          categoryName={category?.name ?? active.categoryId}
          onPick={bet}
          onTimeout={callTime}
        />
      ) : (
        <LiveQuestion
          state={state}
          canAnswerNow={canAnswer(state, me)}
          iAmActing={iAmActing}
          prompt={question.question.prompt}
          face={question.question.face}
          categoryId={active.categoryId}
          options={question.options}
          repeat={active.repeat}
          categoryName={category?.name ?? active.categoryId}
          difficulty={active.difficulty ?? 'low'}
          onAnswer={answer}
          onTimeout={callTime}
          amOpponent={!iAmActing}
        />
      )}

      {myTeam === undefined && (
        <Notice>
          You are watching this one. You will be able to join a team for the next game.
        </Notice>
      )}
    </Screen>
  );
}

/**
 * Anyone in the WebRTC room gets full backfill (that is what "no server, no
 * gatekeeper" means) - a stranger who merely learned the join code can sit
 * in as a silent observer with no signal ever telling the real players
 * they're there, short of counting connections by hand. This counts for
 * them: known players vs. actual peers, with a grace window before
 * flagging anything, since a genuine joiner's own `player/joined` takes a
 * moment to land after their connection does.
 */
function UnexpectedPeerWarning({
  state,
  peerCount,
}: {
  state: GameState;
  peerCount: number;
}): ReactNode {
  const settled = useElapsed(5_000);
  const knownPlayers = Object.keys(state.players).length;
  const deviceCount = peerCount + 1;
  if (!settled || deviceCount <= knownPlayers) return null;
  return (
    <Notice tone="warn">
      {deviceCount} devices connected but only {knownPlayers} known player
      {knownPlayers === 1 ? '' : 's'}. Someone may be watching who never joined - the join code is
      the only lock this game has.
    </Notice>
  );
}

/**
 * Sighted players get instant visual feedback the moment a score changes or
 * the turn passes - a screen-reader user got nothing proactive at all until
 * this, only whatever they happened to already be focused on. One
 * `aria-live` region, updated on the two events that actually matter here:
 * a turn resolving (right/wrong/timed out, and by how much) and the turn
 * passing to a new team.
 */
function TurnAnnouncer({
  state,
  lastTurn,
  actingTeamName,
}: {
  state: GameState;
  lastTurn: TurnRecord | null;
  actingTeamName: string | null;
}): ReactNode {
  const [message, setMessage] = useState('');
  const lastAnnouncedTurn = useRef<number | null>(null);
  const lastAnnouncedActor = useRef<string | null>(null);

  // One effect, not two: a wrong or timed-out answer passing the turn changes
  // both `lastTurn` and `actingTeamName` in the same state transition, and
  // two independent effects both calling setMessage in that case would race
  // - whichever runs second wins, silently dropping the outcome half of the
  // announcement in exactly the case (turn passing) where it matters most.
  useEffect(() => {
    const turnChanged = lastTurn !== null && lastAnnouncedTurn.current !== lastTurn.turnIndex;
    const actorChanged = actingTeamName !== null && lastAnnouncedActor.current !== actingTeamName;
    if (!turnChanged && !actorChanged) return;

    const parts: string[] = [];
    if (turnChanged && lastTurn !== null) {
      lastAnnouncedTurn.current = lastTurn.turnIndex;
      const team = state.teams.find((t) => t.id === lastTurn.teamId)?.name ?? 'They';
      const outcome = lastTurn.timedOut ? 'ran out of time' : lastTurn.correct ? 'were right' : 'were wrong';
      const delta = lastTurn.delta > 0 ? `+${lastTurn.delta}` : `${lastTurn.delta}`;
      parts.push(`${team} ${outcome}, ${delta} points.`);
    }
    if (actorChanged && actingTeamName !== null) {
      lastAnnouncedActor.current = actingTeamName;
      parts.push(`${actingTeamName}'s turn.`);
    }
    setMessage(parts.join(' '));
  }, [lastTurn, actingTeamName, state.teams]);

  return (
    <div aria-live="polite" role="status" className="sr-only">
      {message}
    </div>
  );
}

function Scores({ state, me }: { state: GameState; me: string }): ReactNode {
  const rows = scoreboard(state);
  const myTeamId = teamOf(state, me)?.id;
  return (
    <div className="flex flex-col gap-2">
      {rows.map((row) => (
        <div
          key={row.team.id}
          className={`rounded-xl border px-3 py-2 ${
            row.isActing ? 'border-primary/60 bg-primary/5' : 'border-default-200/30'
          }`}
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate text-sm font-medium">{row.team.name}</span>
              {row.team.id === myTeamId && (
                <Chip color="success" variant="soft" size="sm">
                  you
                </Chip>
              )}
              {row.isActing && (
                <Chip color="accent" variant="soft" size="sm">
                  playing
                </Chip>
              )}
            </span>
            <span className="font-mono text-sm tabular-nums">{row.score}</span>
          </div>
          <ProgressBar
            value={Math.round(row.progress * 100)}
            aria-label={`${row.team.name} progress toward ${state.rules.targetScore}`}
            size="sm"
            color={row.isLeader ? 'success' : 'default'}
            className="mt-2"
          >
            <ProgressBar.Track>
              <ProgressBar.Fill style={{ width: `${Math.round(row.progress * 100)}%` }} />
            </ProgressBar.Track>
          </ProgressBar>
        </div>
      ))}
      {state.streak > 1 && (
        <p className="text-center text-xs text-muted">
          {state.streak} correct in a row - the turn has not moved.
        </p>
      )}
    </div>
  );
}

/**
 * The gap between turns, which is also where the last answer is explained.
 *
 * The engine has no "reveal" phase: a resolved turn simply has no active
 * question. So this panel does double duty, and the explanation is here rather
 * than in a modal because the point is for the whole table to read it (R-18).
 */
function BetweenTurns({
  state,
  me,
  lastTurn,
  onDeal,
  canDealNow,
}: {
  state: GameState;
  me: string;
  lastTurn: TurnRecord | null;
  onDeal: () => void;
  canDealNow: boolean;
}): ReactNode {
  const actingTeam = scoreboard(state).find((row) => row.isActing)?.team;
  // DESIGN.md §5.5: minimum reveal dwell before the equivalent of "Next" (here,
  // dealing the next turn) enables - keyed on the turn so a fresh reveal always
  // gets its own dwell, not whatever is left over from the previous one.
  const dwellElapsed = useRevealDwell(lastTurn?.turnIndex ?? -1);

  return (
    <div className="flex flex-col gap-4">
      {lastTurn !== null && <Outcome key={lastTurn.turnIndex} record={lastTurn} state={state} />}

      <Card>
        <Card.Header>
          <Card.Title>{actingTeam?.name ?? 'Next team'} are up</Card.Title>
          <Card.Description>
            {canDealNow
              ? "You'll get three categories to choose from for their question. They cannot deal their own - that is what stops them knowing the question in advance."
              : 'An opposing team is dealing three categories to choose from.'}
          </Card.Description>
        </Card.Header>
        {canDealNow && (
          <Card.Footer>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              isDisabled={lastTurn !== null && !dwellElapsed}
              onPress={onDeal}
            >
              Deal three categories
            </Button>
          </Card.Footer>
        )}
      </Card>

      {!canDealNow && isActingPlayer(state, me) && (
        <p className="text-center text-sm text-muted">Waiting for your opponents to deal.</p>
      )}
    </div>
  );
}

/**
 * The reveal, promoted. Morphological awareness — knowing that words come apart
 * into meaning-bearing pieces — is the largest single contributor to L2 Chinese
 * reading, ahead of vocabulary size (DESIGN.md §1), so this is the screen that
 * teaches and it gets the room. It never auto-advances; the table dismisses it.
 *
 * DESIGN.md §2.5/§5.5: the reveal is two stages. Stage 1 is automatic - the
 * hanzi alone for ~800 ms, then the correct answer plus (when a lure was
 * chosen) that lure named and marked wrong, all at full size, nothing else.
 * Stage 2 is an explicit tap: every option glossed, wrong rows kept fully
 * legible. The component breakdown is a further explicit tap beyond that -
 * "the reveal's primary optional layer" (§3.3), never shown automatically.
 */
function Outcome({ record, state }: { record: TurnRecord; state: GameState }): ReactNode {
  const question = questionById(SEED_PACK, record.questionId);
  const team = state.teams.find((t) => t.id === record.teamId);
  const correctText = question?.options[question.answer];
  const face = question?.face;
  const hanziAlone = useStage1HanziAlone(record.turnIndex);
  const [stage2, setStage2] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <Card className="anim-reveal" variant={record.correct ? 'secondary' : 'tertiary'}>
      <Card.Header>
        <Card.Title className="flex items-center justify-between gap-3 text-base">
          <span>
            {team?.name ?? 'They'}{' '}
            {record.timedOut ? 'ran out of time' : record.correct ? 'were right' : 'were wrong'}
          </span>
          <span
            className={`font-mono tabular-nums ${record.delta > 0 ? 'text-success' : 'text-danger-text'}`}
          >
            {record.delta > 0 ? `+${record.delta}` : record.delta}
          </span>
        </Card.Title>
      </Card.Header>

      {question !== undefined && (
        <Card.Content className="flex flex-col gap-4 text-sm">
          {face !== undefined && (
            <div className="rounded-[3px] bg-[#f4f4f2] px-5 py-5 text-center">
              <div className="font-han text-[3.4rem] font-medium leading-none tracking-[0.05em] text-[#14140f]">
                {face.hanzi}
              </div>
              {!hanziAlone && (
                <div className="anim-fade-in">
                  <div className="mt-3 text-[1.05rem] font-medium text-[#5a5a52]">{face.pinyin}</div>
                  <div className="mt-2.5 border-t border-black/10 pt-2.5 text-[0.95rem] text-[#14140f]">
                    <strong className="font-semibold">{correctText}</strong>
                    <span className="text-[#5a5a52]"> &middot; {face.nl}</span>
                  </div>
                  {record.chosenText !== null && !record.correct && (
                    <p className="mt-2 text-[0.9rem]">
                      <span className="text-[#5a5a52]">They said: </span>
                      <span className="font-medium text-danger-text">{record.chosenText}</span>
                      <span className="text-danger-text"> — wrong</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {!hanziAlone && !stage2 && (
            <Button variant="ghost" size="sm" fullWidth onPress={() => setStage2(true)}>
              Show every option
            </Button>
          )}

          {!hanziAlone && stage2 && (
            <div className="anim-fade-in flex flex-col gap-2">
              {question.options.map((option, i) => {
                const isCorrect = i === question.answer;
                const isChosenWrong = !isCorrect && option === record.chosenText;
                return (
                  <div
                    key={option}
                    className={`rounded-xl border px-3 py-2.5 text-[0.9rem] ${
                      isCorrect
                        ? 'border-l-4 border-l-success border-default-200/40'
                        : 'border-default-200/40'
                    }`}
                  >
                    <span className={isChosenWrong ? 'font-medium text-danger-text' : ''}>
                      {option}
                    </span>
                    {isChosenWrong && <span className="text-danger-text"> — wrong</span>}
                  </div>
                );
              })}

              {(question.decomposition !== undefined || face?.transparency === 'opaque') && (
                <>
                  {!showBreakdown ? (
                    <Button variant="ghost" size="sm" fullWidth onPress={() => setShowBreakdown(true)}>
                      See how it&apos;s made
                    </Button>
                  ) : (
                    <div className="anim-fade-in flex flex-col gap-2">
                      {hasSelfExplanationPrompt(question) && (
                        <SelfExplanationPrompt cues={discriminatingCues(question)} />
                      )}
                      <DecompositionPanel
                        decomposition={question.decomposition}
                        transparency={face?.transparency}
                        structure={face?.structure}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {!hanziAlone && (
            <p className="text-muted">
              {withGlyphs(question.explanation)}
              {question.glossProvenance !== undefined && (
                <span className="ml-1.5 text-[0.65rem] uppercase tracking-wide text-muted/70">
                  ({question.glossProvenance === 'etymological' ? 'etymological' : 'mnemonic, not history'})
                </span>
              )}
            </p>
          )}
        </Card.Content>
      )}
    </Card>
  );
}

/**
 * Three categories, picked from the bag, offered to whoever is dealing.
 * Nothing here is a bet - the acting team learns which one only once someone
 * off their own team commits to it (R-10).
 */
function ChooseCategory({
  state,
  options,
  canChoose,
  onPick,
  onTimeout,
}: {
  state: GameState;
  options: readonly CategoryId[];
  canChoose: boolean;
  onPick: (categoryId: CategoryId) => void;
  onTimeout: () => void;
}): ReactNode {
  const turnIndex = state.active?.turnIndex ?? -1;
  const picked = useRef<number | null>(null);
  const [pending, setPending] = useState(false);
  if (picked.current !== turnIndex) {
    picked.current = null;
    if (pending) setPending(false);
  }

  return (
    <div className="anim-enter flex flex-col gap-4">
      <Card>
        <Card.Header>
          <Card.Title>Choose a category</Card.Title>
          <Card.Description>
            {canChoose
              ? 'Pick one of the three - they will not know which until you do.'
              : 'An opposing player is choosing which of three categories to deal.'}
          </Card.Description>
        </Card.Header>
      </Card>

      <PhaseTimer
        turnPhaseKey={`${state.gameId}:${turnIndex}:category`}
        durationMs={DIFFICULTY_TIERS.low.timeoutMs}
        state={state}
        onTimeout={onTimeout}
      />

      {canChoose && (
        <div className="flex flex-col gap-3">
          {options.map((categoryId) => {
            const category = categoryById(categoryId);
            return (
              <button
                key={categoryId}
                type="button"
                disabled={pending}
                onClick={() => {
                  if (picked.current === turnIndex) return;
                  picked.current = turnIndex;
                  setPending(true);
                  onPick(categoryId);
                }}
                className="rounded-2xl border border-default-200/40 px-4 py-4 text-left transition hover:border-primary/60 hover:bg-primary/5 disabled:cursor-default disabled:opacity-60"
              >
                <span className="font-medium">{category?.name ?? categoryId}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChooseTier({
  state,
  canChoose,
  categoryName,
  onPick,
  onTimeout,
}: {
  state: GameState;
  canChoose: boolean;
  categoryName: string;
  onPick: (difficulty: Difficulty) => void;
  onTimeout: () => void;
}): ReactNode {
  const turnIndex = state.active?.turnIndex ?? -1;
  const picked = useRef<number | null>(null);
  const [pending, setPending] = useState(false);
  if (picked.current !== turnIndex) {
    picked.current = null;
    if (pending) setPending(false);
  }

  return (
    <div className="anim-enter flex flex-col gap-4">
      <Card>
        <Card.Header>
          <Card.Description>Your category is</Card.Description>
          <Card.Title className="text-2xl">{categoryName}</Card.Title>
        </Card.Header>
        <Card.Content>
          <p className="text-sm text-muted">
            {canChoose
              ? 'How hard do you want it? You are betting before you see the question.'
              : `Waiting for ${
                  scoreboard(state).find((row) => row.isActing)?.team.name ?? 'them'
                } to choose a level.`}
          </p>
        </Card.Content>
      </Card>

      <PhaseTimer
        turnPhaseKey={`${state.gameId}:${turnIndex}:tier`}
        durationMs={DIFFICULTY_TIERS.low.timeoutMs}
        state={state}
        onTimeout={onTimeout}
      />

      {canChoose && (
        <div className="flex flex-col gap-3">
          {DIFFICULTY_ORDER.map((difficulty) => {
            const tier = DIFFICULTY_TIERS[difficulty];
            return (
              <button
                key={difficulty}
                type="button"
                disabled={pending}
                onClick={() => {
                  if (picked.current === turnIndex) return;
                  picked.current = turnIndex;
                  setPending(true);
                  onPick(difficulty);
                }}
                className={`rounded-2xl border px-4 py-4 text-left transition hover:brightness-110 disabled:cursor-default disabled:opacity-60 ${
                  {
                    low: 'border-tier-low/50 bg-tier-low/10',
                    mid: 'border-tier-mid/50 bg-tier-mid/10',
                    high: 'border-tier-high/50 bg-tier-high/10',
                  }[difficulty]
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium">{tier.label}</span>
                  <span className="font-mono text-sm tabular-nums">
                    <span className="text-success">+{tier.award}</span>
                    <span className="text-muted"> / </span>
                    <span className="text-danger-text">{tier.penalty}</span>
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {tier.timeoutMs / 1000} seconds to answer
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LiveQuestion({
  state,
  canAnswerNow,
  iAmActing,
  prompt,
  face,
  categoryId,
  options,
  repeat,
  categoryName,
  difficulty,
  onAnswer,
  onTimeout,
  amOpponent,
}: {
  state: GameState;
  canAnswerNow: boolean;
  iAmActing: boolean;
  prompt: string;
  face: SignFace | undefined;
  categoryId: CategoryId;
  options: readonly string[];
  repeat: boolean;
  categoryName: string;
  difficulty: Difficulty;
  onAnswer: (index: number) => void;
  onTimeout: () => void;
  amOpponent: boolean;
}): ReactNode {
  const turnKey = `${state.gameId}:${state.active?.turnIndex ?? -1}:answer:${difficulty}`;
  // activeTimeoutMs(state) would also work here, but LiveQuestion only ever
  // renders once a difficulty is chosen (that's what makes `difficulty` a
  // required prop rather than optional) - reading the tier table directly
  // from it says so in the type, rather than routing through a selector
  // whose whole point is handling the "not chosen yet" case this call site
  // structurally can't be in.
  const remaining = useCountdown(turnKey, DIFFICULTY_TIERS[difficulty].timeoutMs);
  const lowTimeMessage = useLowTimeAnnouncement(remaining, turnKey);
  const nominated = state.active?.nominatedId;
  const nominatedName = nominated == null ? null : state.players[nominated]?.username ?? null;

  // Opponents call time, not the team on the clock, and they stagger by a
  // deterministic offset so five devices do not all fire the same event at once.
  useAutoTimeout({ enabled: amOpponent, remaining, state, onTimeout });

  // canAnswerNow only flips false once the store's own re-render lands, which
  // is a real gap on mobile browsers that can fire duplicate touch+click
  // events within one synchronous tick - disabling immediately on the first
  // tap, independent of that round trip, is what actually closes it.
  const turnIndex = state.active?.turnIndex ?? -1;
  const answered = useRef<number | null>(null);
  const [pending, setPending] = useState(false);
  if (answered.current !== turnIndex) {
    answered.current = null;
    if (pending) setPending(false);
  }
  const locked = pending || !canAnswerNow;
  // DESIGN.md §4.10.3: a silent, generous window with a subtle desaturation
  // in its final fifth, rather than a ticking digit or shrinking bar - this
  // sits alongside the existing numeric readout below rather than replacing
  // it (removing that display is a timing-control change, out of this
  // phase's purely-visual scope; see PLAN.md Phase 6).
  const timingWarn = remaining > 0 && remaining <= DIFFICULTY_TIERS[difficulty].timeoutMs * 0.2;

  return (
    <div className="anim-enter flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <TierBadge difficulty={difficulty} />
        <span
          className={`font-mono text-sm tabular-nums ${remaining <= 10_000 ? 'text-danger-text' : 'text-muted'}`}
        >
          {Math.max(0, Math.ceil(remaining / 1000))}s
        </span>
        <span aria-live="assertive" role="status" className="sr-only">
          {lowTimeMessage}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted">
          {categoryName}
          {repeat && ' - seen before, the pack ran dry'}
        </span>
      </div>

      {face !== undefined && (
        <div className="sign-timing-warn" data-warn={timingWarn}>
          <Sign
            template={templateFor(categoryId)}
            category={categoryId}
            hanzi={face.hanzi}
            pinyin={difficulty === 'low' ? face.pinyin : undefined}
          />
        </div>
      )}

      <p className="text-xl font-medium leading-snug tracking-[-0.01em]">{prompt}</p>

      <Card>
        <Card.Content className="flex flex-col gap-2.5 pt-4">
          {options.map((option, index) => (
            <button
              key={option}
              type="button"
              disabled={locked}
              onClick={() => {
                if (answered.current === turnIndex) return;
                answered.current = turnIndex;
                setPending(true);
                onAnswer(index);
              }}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                !locked
                  ? 'border-default-200/50 hover:border-primary/70 hover:bg-primary/10'
                  : 'cursor-default border-default-200/20 text-muted'
              }`}
            >
              <span className="mr-2 font-mono text-xs text-muted">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </Card.Content>
      </Card>

      {iAmActing && nominatedName !== null && (
        <p className="text-center text-xs text-muted">
          {nominatedName}&apos;s turn to answer for the team - though anyone on it can tap.
        </p>
      )}
      {!iAmActing && (
        <p className="text-center text-sm text-muted">
          Their question. You can see it, so no helping.
        </p>
      )}

      <CallTimeButton onPress={onTimeout} />
    </div>
  );
}

/** Any peer may call time (R-3) - a stuck turn should never need to wait out a stagger nobody's device is running. */
function CallTimeButton({ onPress }: { onPress: () => void }): ReactNode {
  return (
    <Button variant="ghost" size="sm" fullWidth onPress={onPress}>
      Something stuck? Call time
    </Button>
  );
}

/**
 * The category-pick and difficulty-pick phases used to have no timer or
 * timeout path at all: an opponent who walks away mid-pick left the whole
 * table stuck with no countdown and no way out. This gives them the same
 * "doing nothing still costs the cheapest tier" treatment the reducer
 * already applies to a timeout with no difficulty chosen yet (turn/timeout
 * defaults to low - see reducer.ts), rather than leaving these two
 * phases exempt from having a clock at all.
 */
function PhaseTimer({
  turnPhaseKey,
  durationMs,
  state,
  onTimeout,
}: {
  turnPhaseKey: string;
  durationMs: number;
  state: GameState;
  onTimeout: () => void;
}): ReactNode {
  const remaining = useCountdown(turnPhaseKey, durationMs);
  const lowTimeMessage = useLowTimeAnnouncement(remaining, turnPhaseKey);
  const me = useApp((s) => s.identity?.id ?? '');
  const amOpponent = !isActingPlayer(state, me);
  useAutoTimeout({ enabled: amOpponent, remaining, state, onTimeout });

  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={`font-mono text-sm tabular-nums ${remaining <= 10_000 ? 'text-danger-text' : 'text-muted'}`}
      >
        {Math.max(0, Math.ceil(remaining / 1000))}s to decide
      </span>
      <span aria-live="assertive" role="status" className="sr-only">
        {lowTimeMessage}
      </span>
      <Button variant="ghost" size="sm" onPress={onTimeout}>
        Call time
      </Button>
    </div>
  );
}

/**
 * Countdown from the moment this device first saw this exact turn phase,
 * persisted to localStorage so a reload mid-turn (this app supports
 * resuming one, per App.tsx) restores the real elapsed time instead of
 * silently resetting the clock back to the full duration while the actual,
 * opponent-enforced timeout keeps running on schedule regardless.
 *
 * Not from a timestamp in the event, still: clocks are not synchronised and
 * a peer that lies about its clock should not be able to shorten anyone's
 * turn. The cost is that timers differ slightly between devices, which is
 * why the timeout is an event any peer proposes rather than a deadline
 * everyone computes.
 */
function useCountdown(key: string, durationMs: number): number {
  const started = useRef<{ key: string; at: number }>({ key, at: readOrStampTurnStart(key) });
  const [now, setNow] = useState(() => Date.now());

  if (started.current.key !== key) started.current = { key, at: readOrStampTurnStart(key) };

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  return Math.max(0, started.current.at + durationMs - now);
}

const TURN_START_KEY = 'kanbudong.turnStart.v1';

/** One slot, overwritten every phase change - only the current turn's phase ever needs restoring. */
function readOrStampTurnStart(key: string): number {
  try {
    const raw = globalThis.localStorage?.getItem(TURN_START_KEY);
    const parsed = raw === null || raw === undefined ? null : (JSON.parse(raw) as { key?: string; at?: number });
    if (parsed?.key === key && typeof parsed.at === 'number') return parsed.at;
  } catch {
    /* corrupted or unavailable - fall through to a fresh stamp */
  }
  const at = Date.now();
  try {
    globalThis.localStorage?.setItem(TURN_START_KEY, JSON.stringify({ key, at }));
  } catch {
    /* private mode or quota - the countdown just won't survive a reload this time */
  }
  return at;
}

/**
 * The only signal that time is short was a colour change on the visible
 * countdown - nothing a screen-reader user would ever notice. Announces
 * once, the moment remaining time first crosses ten seconds, per turn phase.
 */
function useLowTimeAnnouncement(remaining: number, key: string): string {
  const announcedFor = useRef<string | null>(null);
  if (remaining > 10_000 || remaining <= 0) {
    if (remaining > 10_000) announcedFor.current = null;
    return '';
  }
  if (announcedFor.current === key) return '';
  announcedFor.current = key;
  return 'Ten seconds left.';
}

function useAutoTimeout({
  enabled,
  remaining,
  state,
  onTimeout,
}: {
  enabled: boolean;
  remaining: number;
  state: GameState;
  onTimeout: () => void;
}): void {
  const fired = useRef<number | null>(null);
  const turnIndex = state.active?.turnIndex ?? -1;
  const stagger = useMemo(() => {
    const me = useApp.getState().identity?.id ?? '';
    const opponents = Object.keys(state.players)
      .filter((id) => !isActingPlayer(state, id))
      .sort();
    return Math.max(0, opponents.indexOf(me)) * 600;
  }, [state]);

  useEffect(() => {
    if (!enabled || remaining > 0 || turnIndex < 0) return;
    if (fired.current === turnIndex) return;
    fired.current = turnIndex;
    const id = setTimeout(onTimeout, stagger);
    return () => clearTimeout(id);
  }, [enabled, remaining, turnIndex, stagger, onTimeout]);
}
