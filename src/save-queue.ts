// Coalesce pending edits and serialize writes so an older request cannot win.
export function createSaveQueue({ delay = 350, onState = (_state: string) => {} }: { delay?: number; onState?: (state: string) => void } = {}) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: (() => Promise<void>) | undefined;
  let failed: (() => Promise<void>) | undefined;
  let chain = Promise.resolve();
  let cancelled = false;
  let lastError: unknown;

  function enqueue() {
    clearTimeout(timer);
    if (!pending || cancelled) return;
    const work = pending;
    pending = undefined;
    chain = chain.then(async () => {
      if (cancelled) return;
      onState("Saving...");
      try {
        await work();
        lastError = undefined;
        failed = undefined;
        if (!cancelled && !pending) onState("Saved to server");
      } catch (error) {
        lastError = error;
        failed = work;
        if (!cancelled) onState(`Could not save: ${error instanceof Error ? error.message : "server unavailable"}`);
      }
    });
  }

  return {
    schedule(work: () => Promise<void>) {
      cancelled = false;
      pending = work;
      clearTimeout(timer);
      onState("Unsaved changes");
      timer = setTimeout(enqueue, delay);
    },
    cancelPending() {
      clearTimeout(timer);
      pending = undefined;
    },
    async flush() {
      do {
        enqueue();
        await chain;
      } while (pending && !cancelled);
      if (lastError) throw lastError;
    },
    retry() {
      if (!pending) pending = failed;
      return this.flush();
    },
    cancel() {
      cancelled = true;
      clearTimeout(timer);
      pending = undefined;
    },
  };
}
