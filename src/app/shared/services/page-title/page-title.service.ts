import { inject, Service, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '../i18n/i18n.service';

@Service()
export class PageTitleService {

    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private readonly I18n = inject(I18nService);

    #pageTitle = signal<string>('');
    pageTitle = this.#pageTitle.asReadonly();

    constructor() {
        this.router.events.subscribe(() => {
            const routeData = this.getRouteData(this.activatedRoute);
            if (routeData && routeData['title']) {
                this.#pageTitle.set(routeData['title'].toUpperCase());
            } else {
                this.#pageTitle.set('');
            }
        });
    }

    private getRouteData(route: ActivatedRoute): any {
        let data = route.snapshot.data;
        if (route.firstChild) {
            data = { ...data, ...this.getRouteData(route.firstChild) };
        }
        return data;
    }
    
}
