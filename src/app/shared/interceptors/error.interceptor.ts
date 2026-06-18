import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

// import { MessageService } from '../services/message/message.service';
// import { ToastService } from '../services/toast/toast.service';
import { Router } from '@angular/router';
// import { AuthService } from '../../auth/store/auth.service';

/**
 * Http error interceptor
 * 
 * @param req 
 * @param next 
 * @returns 
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  // const messageSrv = inject(MessageService);
  // const authSrv = inject(AuthService);
  // const toastSrv = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    tap({
      next: (event) => {           
              
        if (event instanceof HttpResponse && event.headers.has('X-ReturnInt') && event.headers.get('X-ReturnInt') !== '0') {
                      
            // Throw object with returnInt and returnText keys 
            throw {returnInt: event.headers.get('X-ReturnInt'), returnText: event.headers.get('X-ReturnText')};

        }
        
      },
      error: (error) => {  
           
        // if (error instanceof HttpErrorResponse) {  
          
        //   if (error.status === 401) {
        //     authSrv.logout();
        //     router.navigate(['/', 'login']);
        //   } else {
        //     const statusText = error.status === 0 ? 'Unknown Error' : error.statusText;
        //     const status = error.status === 0 ? '' : error.status.toString();
        //     toastSrv.onError(status, statusText);
        //   };
          
        // }

      }
    })
  );

}
