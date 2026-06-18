import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * Service class for displaying loader on http request
 * 
 * @class LoadingService
 */
export class LoadingService {

  #loadingSignal = signal(false);
  loading = this.#loadingSignal.asReadonly();

  /**
   * Show loader
   */
  loadingOn(): void {

    this.#loadingSignal.set(true);
    
  }
  
  /**
   * Hide loader
  */
  loadingOff(): void {

    this.#loadingSignal.set(false);
    
  }

}
