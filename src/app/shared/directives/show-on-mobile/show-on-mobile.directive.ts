import { Directive, Input, TemplateRef, ViewContainerRef, inject, input } from '@angular/core';
import { ScreensizeService } from '../../services/screen-size/screen-size.service';

@Directive({
  selector: '[appShowOnMobile]'
})
/**
 * Directive for displaying DOM elemenis based on divace type, mobile or desktop
 * 
 * @class ShowOnMobileDirective
 */
export class ShowOnMobileDirective {

  private readonly screenSizeSrv = inject(ScreensizeService);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);

  @Input('appShowOnMobileValue') showOnMobile!: boolean;
  
  ngOnInit() {

    this.screenSizeSrv.isDesktop.subscribe(isDesktop => {

      this.viewContainer.clear();

      if ((this.showOnMobile && !isDesktop) || (!this.showOnMobile && isDesktop)) {

        this.viewContainer.createEmbeddedView(this.templateRef);

      }

    });

  }

}
