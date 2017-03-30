import { Component, OnInit } from '@angular/core';
import { Subscription, SubscriptionResponse } from '@freescan/skeleton';

import { BillingService } from '../billing.service';

@Component({
    selector:    'freescan-subscriptions',
    templateUrl: './subscriptions.component.html',
})
export class SubscriptionsComponent implements OnInit {
    public subscriptions: Subscription[] = [];

    constructor(private billingService: BillingService) {
    }

    public ngOnInit(): void {
        this.subscriptions = this.billingService.subscriptionsResponse
            ? this.billingService.subscriptionsResponse.data : [];
    }

    /**
     * Unsubscribe to a given subscription.
     */
    public deleteSubscription(subscription: Subscription): void {
        this.billingService
            .deleteSubscription(subscription)
            .subscribe(
                (response: SubscriptionResponse) => {
                    console.log(response);
                    alert('Unsubscribed!');
                },
                (error: SubscriptionResponse) => {
                    console.error(error);
                    alert('An error occurred.');
                },
            );
    }
}
