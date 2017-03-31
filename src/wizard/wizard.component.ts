import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { utc } from 'moment';
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
            .filter((subscription: Subscription) => {
                // Filter out subscriptions that have ended
                return subscription && subscription.ends_at
                    ? utc().isAfter(utc(subscription.ends_at))
                    : false;
            })
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
