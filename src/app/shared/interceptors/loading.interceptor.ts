import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { SkipLoading } from '../ui/loading/skip-loading.component';
import { LoadingService } from '../services/loading/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {

  if(req.context.get(SkipLoading)) {
    return next(req);
  }

  const loadingSrv = inject(LoadingService);
  
  loadingSrv.loadingOn();

  return next(req).pipe(
    finalize(() => {
      loadingSrv.loadingOff();
    })
  );

};
