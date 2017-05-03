import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, WindowService } from '@freescan/skeleton';

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
        this.modalService.title = 'Unlimited Access';
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
            .navigate([], { queryParams: { module: 'billing', step: 'plans' } })
            .catch((error: Error) => console.error(error));
    }

    /**
     * Begin the login flow.
     */
    public login(): void {
        this.loading = true;
        let state: string = this.window.location ? this.window.location.href : null;
        this.authentication.login(state);
    }
}
