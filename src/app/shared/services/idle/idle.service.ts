import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, merge, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];

@Injectable({ providedIn: 'root' })
export class IdleService implements OnDestroy {

  private idleSeconds = 1199;
  private timeoutSeconds = 1;

  private activity$ = merge(
    ...ACTIVITY_EVENTS.map(event => fromEvent(document, event))
  );

  readonly onIdleEnd = new Subject<void>();
  readonly onTimeout = new Subject<void>();

  private watchSub: Subscription | null = null;
  private readonly destroy$ = new Subject<void>();

  watch(): void {
    this.stop();

    this.watchSub = this.activity$.pipe(
      debounceTime(200),
      switchMap(() => {
        this.onIdleEnd.next();
        return timer((this.idleSeconds + this.timeoutSeconds) * 1000);
      }),
      takeUntil(this.destroy$)
    ).subscribe(() => this.onTimeout.next());

    // Start the initial idle countdown (no activity yet)
    timer((this.idleSeconds + this.timeoutSeconds) * 1000).pipe(
      takeUntil(merge(this.activity$, this.destroy$))
    ).subscribe(() => this.onTimeout.next());
  }

  stop(): void {
    this.watchSub?.unsubscribe();
    this.watchSub = null;
  }

  setIdle(seconds: number): void {
    this.idleSeconds = seconds;
  }

  setTimeout(seconds: number): void {
    this.timeoutSeconds = seconds;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
