import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Plan, Subscription, SubscriptionResponse } from '@freescan/skeleton';

import { BillingService } from '../billing.service';

@Component({
    selector:    'freescan-subscriptions',
    templateUrl: './subscriptions.component.html',
})
export class SubscriptionsComponent implements OnInit {
    constructor(private route: ActivatedRoute,
                private router: Router,
                public billing: BillingService) {
    }

    public ngOnInit(): void {
        //
    }

    /**
     * Check whether the user has a subscription to the given plan.
     */
    public subscribed(plan: Plan): boolean {
        return _.find(this.billing.subscriptions, { plan: { data: { id: plan.id } } });
    }

    /**
     * Unsubscribe from a given subscription.
     */
    public deleteSubscription(subscription: Subscription): void {
        this.billing
            .deleteSubscription(subscription)
            .subscribe(
                (response: SubscriptionResponse) => {
                    alert('Unsubscribed!');
                    this.billing.subscriptions = [];
                    this.router.navigate(['/'], { relativeTo: this.route });
                },
                (error: SubscriptionResponse) => {
                    console.error(error);
                    alert('An error occurred.');
                    this.billing.subscriptions = [];
                },
            );
    }
}
