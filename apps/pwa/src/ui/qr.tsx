import { Button } from '@heroui/react';
import QRCode from 'qrcode';
import QrScanner from 'qr-scanner';
// Vite hands back a served URL for the worker; qr-scanner falls back to it on
// browsers without a native BarcodeDetector, which is most of them.
import workerUrl from 'qr-scanner/qr-scanner-worker.min.js?url';
import { useEffect, useRef, useState, type ReactNode } from 'react';

QrScanner.WORKER_PATH = workerUrl;

/**
 * The invitation. Two phones, one screen, one camera - no typing, no accounts,
 * no link to send. This is the interaction the whole product is shaped around,
 * which is also why the PWA is the primary surface: nobody installs an app in
 * the middle of being invited to a game.
 */
export function QrImage({ value, size = 260 }: { value: string; size?: number }): ReactNode {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, {
      errorCorrectionLevel: 'M',
      margin: 2,
      scale: 8,
      // Deliberately light-on-dark inverted: a phone camera reads a bright code
      // far more reliably than a dark one, whatever the app's theme is.
      color: { dark: '#111122ff', light: '#ffffffff' },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [value]);

  if (failed) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-danger/40 bg-danger/10 p-6 text-center text-sm">
        Could not draw the QR code. Read the four words out instead.
      </div>
    );
  }

  return (
    <div
      className="mx-auto flex items-center justify-center rounded-2xl bg-white p-3 shadow-lg"
      style={{ width: size, height: size }}
    >
      {dataUrl === null ? (
        <span className="text-xs text-neutral-500">Drawing...</span>
      ) : (
        <img src={dataUrl} alt="Scan to join this game" className="h-full w-full" />
      )}
    </div>
  );
}

export type ScanState = 'idle' | 'starting' | 'scanning' | 'denied' | 'unsupported';

/**
 * Camera scanner. Fails loudly and usefully: no camera, no permission or an
 * insecure origin each produce a specific message plus the typed-code fallback,
 * because "scanning does not work" with no explanation ends the game.
 */
export function QrCamera({ onScan }: { onScan: (text: string) => void }): ReactNode {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [state, setState] = useState<ScanState>('idle');
  const [detail, setDetail] = useState<string | null>(null);
  // The button press that starts the camera, kept separate from `state`.
  // `state` gets written to *inside* the effect below (starting -> scanning),
  // so if the effect depended on `state` itself, that write would be a
  // dependency change: React tears the scanner down and re-runs the effect,
  // which immediately no-ops (state is no longer 'starting') - the camera
  // starts and is destroyed a moment later, seen as a flicker to a black
  // frame. `armed` only ever flips false -> true, so it can't self-retrigger.
  const [armed, setArmed] = useState(false);

  // Callers pass a fresh closure every render. Reading through a ref keeps
  // the effect below from seeing that as a dependency change and restarting
  // the camera - a restart mid-scan races getUserMedia against its own
  // teardown and can leave the video element on a black frame.
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    if (!armed) return;
    const video = videoRef.current;
    if (video === null) return;

    let scanner: QrScanner | null = null;
    let stopped = false;

    void (async () => {
      try {
        if (!(await QrScanner.hasCamera())) {
          setState('unsupported');
          setDetail('This device has no camera the browser can use.');
          return;
        }
        scanner = new QrScanner(
          video,
          (result) => {
            if (!stopped) onScanRef.current(result.data);
          },
          {
            preferredCamera: 'environment',
            highlightScanRegion: true,
            maxScansPerSecond: 8,
            returnDetailedScanResult: true,
          },
        );
        await scanner.start();
        if (!stopped) setState('scanning');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setState(/denied|permission/i.test(message) ? 'denied' : 'unsupported');
        setDetail(
          globalThis.isSecureContext === false
            ? 'Browsers only allow camera access over HTTPS (or on localhost). Use the four-word code instead.'
            : message,
        );
      }
    })();

    return () => {
      stopped = true;
      scanner?.stop();
      scanner?.destroy();
    };
  }, [armed]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-2xl border border-default-200/40 bg-black/60 aspect-square">
        {/* A live camera feed has nothing for a screen reader to say; the
            surrounding copy and the "Turn on the camera" button already
            explain what this is and offer the typed-code alternative. */}
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          playsInline
          aria-hidden="true"
        />
        {state !== 'scanning' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            {state === 'idle' && (
              <>
                <p className="text-sm text-muted">
                  Point your camera at the other phone&apos;s code.
                </p>
                <Button
                  variant="primary"
                  onPress={() => {
                    setState('starting');
                    setArmed(true);
                  }}
                >
                  Turn on the camera
                </Button>
              </>
            )}
            {state === 'starting' && <p className="text-sm text-muted">Starting camera...</p>}
            {(state === 'denied' || state === 'unsupported') && (
              <p className="text-sm text-danger-text">
                {state === 'denied'
                  ? 'Camera permission was refused.'
                  : 'Camera unavailable.'}{' '}
                {detail}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
