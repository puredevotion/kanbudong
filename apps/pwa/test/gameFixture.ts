import {
  chooseCategory,
  chooseDifficulty,
  createGame,
  createIdentity,
  drawTurn,
  EventLog,
  isActingPlayer,
  joinTeam,
  makeEvent,
  openTeam,
  reduce,
  SEED_PACK,
  SEED_PACK_HASH,
  startGame,
  type GameState,
  type Identity,
} from '@kanbudong/engine';

/**
 * A four-player, two-team game driven far enough to have a live question with
 * a difficulty already chosen (Play.tsx's `LiveQuestion` branch). Mirrors
 * packages/engine/test/table.ts's shape but only through this package's
 * public exports, since that helper lives outside @kanbudong/pwa's rootDir.
 */
export function buildLiveQuestionGame(): { readonly state: GameState; readonly me: Identity } {
  const host = createIdentity('Host');
  const dealer = createIdentity('Dealer');
  const teammate = createIdentity('Teammate');
  const opponent = createIdentity('Opponent');

  let log: EventLog | undefined;
  createGame({
    identity: host,
    name: 'Fixture game',
    packHash: SEED_PACK_HASH,
    makeLog: (gameId) => {
      log = new EventLog(gameId);
      return log;
    },
  });
  if (log === undefined) throw new Error('createGame did not build a log');

  const insert = (event: ReturnType<typeof makeEvent>): void => {
    const result = (log as EventLog).insert(event);
    if (!result.accepted) throw new Error(`fixture event rejected: ${result.reason}`);
  };

  for (const identity of [dealer, teammate, opponent]) {
    insert(makeEvent(log, identity, { type: 'player/joined', username: identity.username }));
  }

  const teamAEvent = openTeam(log, host, 'Home team');
  insert(teamAEvent);
  const teamAId = teamAEvent.body.type === 'team/created' ? teamAEvent.body.teamId : null;
  if (teamAId === null) throw new Error('expected team/created');
  insert(joinTeam(log, teammate, teamAId));

  const teamBEvent = openTeam(log, dealer, 'Away team');
  insert(teamBEvent);
  const teamBId = teamBEvent.body.type === 'team/created' ? teamBEvent.body.teamId : null;
  if (teamBId === null) throw new Error('expected team/created');
  insert(joinTeam(log, opponent, teamBId));

  insert(startGame(log, host));

  const afterStart = reduce(log.events, { pack: SEED_PACK });
  if (afterStart === null) throw new Error('no game/created in the log');

  // Whoever draws must not be on the acting team (R-10).
  const drawer = isActingPlayer(afterStart, dealer.id) ? opponent : dealer;
  insert(drawTurn(log, drawer, afterStart.turnIndex));

  const afterDraw = reduce(log.events, { pack: SEED_PACK });
  const categoryId = afterDraw?.active?.categoryOptions[0];
  if (afterDraw === null || categoryId === undefined) throw new Error('no category options dealt');
  insert(chooseCategory(log, drawer, afterDraw.turnIndex, categoryId));

  const afterCategory = reduce(log.events, { pack: SEED_PACK });
  if (afterCategory === null) throw new Error('no state after choosing category');
  const bettor = isActingPlayer(afterCategory, host.id) ? host : teammate;
  insert(chooseDifficulty(log, bettor, afterCategory.turnIndex, 'low'));

  const finalState = reduce(log.events, { pack: SEED_PACK });
  if (finalState === null) throw new Error('no final state');
  return { state: finalState, me: host };
}
