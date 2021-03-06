import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, WindowService } from '@rndstudio/skeleton';

import { ModalService } from '../+services/modal.service';


@Component({
    selector:    'studio-billing-intro',
    templateUrl: './intro.component.html',
})
export class IntroComponent implements OnInit {
    public loading: boolean = false;
    private window: Window;

    constructor(private router: Router,
                public authentication: AuthenticationService,
                private windowService: WindowService,
                private modalService: ModalService) {
        this.window = this.windowService.nativeWindow;
    }

    public ngOnInit(): void {
        this.modalService.title = 'Get Access to Full Report';
    }

    /**
     * Retrieve the intro text from the ModalService.
     */
    public intro(): string {
        return this.modalService.intro;
    }

    /**
     * Continue to the next step in payment.
     */
    public continue(): void {
        this.router
            .navigate([], { queryParams: { module: 'billing', step: 'plans' }, queryParamsHandling: 'merge' })
            .catch((error: Error) => console.error(error));
    }

    /**
     * Begin the login flow.
     */
    public login(): void {
        this.loading = true;
        let query: string = this.window.location && this.window.location.search
            ? this.window.location.search.replace(/step=intro/, 'step=plans')
            : '?module=billing&step=plans';
        let state: string = this.window.location && this.window.location.href
            ? this.window.location.href.replace(/\?.*/, '') + query
            : null;

        this.authentication.login(state);
    }
}
