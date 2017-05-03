import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@freescan/skeleton';

import { ModalService } from '../+services/modal.service';


@Component({
    selector:    'studio-billing-intro',
    templateUrl: './intro.component.html',
})
export class IntroComponent implements OnInit {
    public loading: boolean = false;

    constructor(private router: Router,
                public authentication: AuthenticationService,
                private modalService: ModalService) {
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
        this.authentication.login();
    }
}
