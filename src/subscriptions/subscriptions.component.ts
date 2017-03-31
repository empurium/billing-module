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
        this.getPlans();
    }

    /**
     * Check whether the user has a subscription to the given plan.
     */
    public ended(endsAt: string): boolean {
        return this.billing.ended(endsAt);
    }

    /**
     * Check whether the user has a subscription to the given plan.
     */
    public subscribed(plan: Plan): boolean {
        if (!this.billing.subscriptions) {
            return false;
        }

        return _.find(this.billing.subscriptions, { data: { id: plan.id } });
    }

    /**
     * Restart an existing (inactive) subscription.
     * TODO: Implement this.
     */
    public restartSubscription(subscription: Subscription): boolean {
        return true;
    }

    /**
     * Change from one plan to another.
     * Clears the cache of the subscription.
     */
    public changeSubscription(subscription: Subscription, plan: Plan): void {
        this.billing
            .changeSubscription(subscription, plan)
            .subscribe(
                (response: SubscriptionResponse) => {
                    alert('Changed plans!');
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

    /**
     * Unsubscribe from a given subscription.
     * Clears the cache of the subscription.
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

    /**
     * Get the available Plans.
     */
    private getPlans(): void {
        this.billing
            .getPlans()
            .subscribe(
                (plans: Plan[]) => {
                    // Accessible from this.billing.plans cache
                },
                (error: string) => console.error(error),
            );
    }
}
