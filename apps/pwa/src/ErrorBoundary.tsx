import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * A blank screen mid-game reads as "the app is broken" with no way back. This
 * is the last line of defense: catch whatever slipped through and offer the
 * one recovery that always works for a device holding no server state.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Uncaught error, showing recovery screen:', error, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.error === null) return this.props.children;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-lg font-semibold">Something went wrong</h1>
        <p className="max-w-sm text-sm text-muted">
          {this.state.error.message || 'The game hit an error it could not recover from.'}
        </p>
        <button
          type="button"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
          onClick={() => globalThis.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }
}
