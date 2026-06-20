import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../i18n/i18n.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service class for displaying toast messages
 * 
 * @class ToastService
 */
export class ToastService {

  private readonly toastr = inject(ToastrService);
  private readonly i18n = inject(I18nService);

  /**
   * Show success toast message
   * 
   * @param message 
   */
  onSuccess(message: string): void {

    this.toastr.success(
      message, 
      '',
      {
        positionClass: "toast-bottom-center",
        timeOut: 3000,
      }
    );

  }

  /**
   * Show error toast message
   * 
   * @param title 
   * @param message 
   */
  onError(title?: string, message?: string): void {   
    
    if (this.toastr.toasts.length === 0) {
      this.toastr.error(
        message ?? this.i18n.translate('error.pleaseTryAgain'), 
        title ?? this.i18n.translate('error.error'), 
        {
          positionClass: "toast-top-center",
          timeOut: 0,
          closeButton: true
        }
      );
    }

  }

  /**
   * Clear all current toasts
   */
  clear(): void {
    this.toastr.clear();
  }

}
