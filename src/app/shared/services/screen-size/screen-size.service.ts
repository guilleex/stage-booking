import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, distinctUntilChanged, map, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Service class that tracks device screen size (mobile or desktop)
 * 
 * @class ScreensizeService
 */
export class ScreensizeService {

  private breakpointObserver = inject(BreakpointObserver);

  private isDesktop$ = new BehaviorSubject<boolean>(false);

  isDesktop = this.isDesktop$.asObservable().pipe(
    distinctUntilChanged(),
    shareReplay()
  );

  isDesktopSignal = toSignal(this.isDesktop$);

  /**
   * Checks screen size and emits new value for isDesktop$ behavior subject
   * 
   * @param value 
   * @return {Observable<boolean>}
   */
  checkSize(): Observable<boolean> {

    return this.breakpointObserver.observe(['(min-width: 840px)']).pipe(
      map(result => {
        this.isDesktop$.next(result.matches);
        return result.matches;
      })
    )

  }

}
 