import { inject, Service, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Service()
export class PageTitleService {

    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    #pageTitle = signal<string>('');
    pageTitle = this.#pageTitle.asReadonly();

    constructor() {
        this.router.events.subscribe(() => {
            const routeData = this.getRouteData(this.activatedRoute);
            if (routeData && routeData['title']) {
                this.#pageTitle.set(routeData['title']);
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
