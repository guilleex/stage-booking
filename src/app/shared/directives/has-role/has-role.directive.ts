import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../../../auth/store/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
/**
 * Directive for displaying DOM elements based on logged in user role
 * 
 * @class HasRoleDirective
 */
export class HasRoleDirective {

  private readonly authSrv = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);

  @Input('appHasRole') roles!: string[];

  user$ = toObservable(this.authSrv.user);

  ngOnInit() {

    this.user$.subscribe(user => {      

      if (this.roles.includes(user?.role!)) {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }

    })


  }

}
