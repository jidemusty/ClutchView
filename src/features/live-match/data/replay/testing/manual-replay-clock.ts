import type { ReplayClock, ScheduledTask } from '../replay-clock';

interface PendingTask {
  readonly id: number;
  readonly runAt: number;
  readonly callback: () => void;
  cancelled: boolean;
}

export class ManualReplayClock implements ReplayClock {
  private currentTime = 0;
  private nextTaskId = 1;
  private readonly tasks: PendingTask[] = [];

  now(): number {
    return this.currentTime;
  }

  schedule(callback: () => void, delayMs: number): ScheduledTask {
    if (delayMs < 0) {
      throw new Error('Cannot schedule a task with a negative delay');
    }

    const task: PendingTask = {
      id: this.nextTaskId,
      runAt: this.currentTime + delayMs,
      callback,
      cancelled: false,
    };

    this.nextTaskId += 1;
    this.tasks.push(task);

    return {
      cancel() {
        task.cancelled = true;
      },
    };
  }

  advanceBy(durationMs: number): void {
    if (durationMs < 0) {
      throw new Error('Cannot move the clock backwards');
    }

    const targetTime = this.currentTime + durationMs;

    while (true) {
      const nextTask = this.findNextTask(targetTime);

      if (nextTask === undefined) {
        break;
      }

      this.removeTask(nextTask.id);

      if (nextTask.cancelled) {
        continue;
      }

      this.currentTime = nextTask.runAt;
      nextTask.callback();
    }

    this.currentTime = targetTime;
  }

  getPendingTaskCount(): number {
    return this.tasks.filter((task) => !task.cancelled).length;
  }

  private findNextTask(targetTime: number): PendingTask | undefined {
    return this.tasks
      .filter((task) => task.runAt <= targetTime)
      .sort((first, second) => {
        if (first.runAt !== second.runAt) {
          return first.runAt - second.runAt;
        }

        return first.id - second.id;
      })[0];
  }

  private removeTask(taskId: number): void {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
    }
  }
}
