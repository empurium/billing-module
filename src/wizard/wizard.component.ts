import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, Subscription } from '@freescan/skeleton';

import { BillingService } from '../billing.service';

@Component({
    selector: 'freescan-wizard',
    template: `<router-outlet></router-outlet>`,
})
export class WizardComponent implements OnInit {
    constructor(private route: ActivatedRoute,
                private router: Router,
                private authentication: AuthenticationService,
                private billing: BillingService) {
    }

    public ngOnInit(): void {
        this.getSubscriptions();
    }

    /**
     * Start the wizard with the appropriate first route depending
     * on whether the user has current subscriptions.
     */
    public getSubscriptions(): void {
        this.billing
            .getSubscriptions(this.authentication.userId())
            .subscribe(
                (response: Subscription) => {
                    this.router.navigate(['subscriptions'], { relativeTo: this.route });
                },
                (error: string): void => {
                    this.router.navigate(['plans'], { relativeTo: this.route });
                },
            );
    }
}
