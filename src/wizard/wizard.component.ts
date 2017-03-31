import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, SubscriptionResponse } from '@freescan/skeleton';

import { BillingService } from '../billing.service';

@Component({
    selector: 'freescan-wizard',
    template: `<router-outlet></router-outlet>`,
})
export class WizardComponent implements OnInit {
    constructor(private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private billingService: BillingService) {
    }

    public ngOnInit(): void {
        this.billingService.getPlans();
        this.start();
    }

    /**
     * Start the wizard with the first route.
     */
    public start(): void {
        this.billingService
            .getSubscriptions(this.authenticationService.userId())
            .subscribe(
                (response: SubscriptionResponse) => {
                    this.billingService.subscriptionsResponse = response;
                    this.router.navigate(['subscriptions'], { relativeTo: this.route });
                },
                (error: Error): void => {
                    this.router.navigate(['plans'], { relativeTo: this.route });
                },
            );
    }
}
