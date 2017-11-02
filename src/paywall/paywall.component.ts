import { Component } from '@angular/core';
import { AuthenticationService } from '@rndstudio/skeleton';

import { ModalService } from '../+services/modal.service';


@Component({
    selector:    'studio-billing-paywall',
    templateUrl: './paywall.component.html',
    styleUrls:   ['./paywall.component.scss'],
})
export class PayWallComponent {
    constructor(private authentication: AuthenticationService,
                private modalService: ModalService) {
    }

    /**
     * Returns whether or not the user has authenticated.
     */
    public authenticated(): boolean {
        return this.authentication.authenticated();
    }

    /**
     * Begin the login process.
     */
    public login(): void {
        this.authentication.login();
    }

    /**
     * Start the payment process.
     */
    public billing(): void {
        this.modalService.events.emit('show');
    }
}
