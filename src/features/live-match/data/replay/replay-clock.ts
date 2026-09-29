export interface ScheduledTask {
  cancel(): void;
}

export interface ReplayClock {
  now(): number;
  schedule(callback: () => void, delayMs: number): ScheduledTask;
}

export const systemReplayClock: ReplayClock = {
  now: () => Date.now(),

  schedule(callback, delayMs) {
    const timeoutId = setTimeout(callback, delayMs);

    return {
      cancel() {
        clearTimeout(timeoutId);
      },
    };
  },
};
