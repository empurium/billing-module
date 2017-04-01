import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Plan, Subscription, SubscriptionResponse } from '@freescan/skeleton';

import { SubscriptionService } from '../+services/subscription.service';
import { PlanService } from '../+services/plan.service';


@Component({
    selector:    'freescan-subscriptions',
    templateUrl: './subscriptions.component.html',
})
export class SubscriptionsComponent implements OnInit {
    constructor(private route: ActivatedRoute,
                private router: Router,
                public subscriptions: SubscriptionService,
                public plans: PlanService) {
    }

    public ngOnInit(): void {
        this.subscriptions.all().subscribe();
    }

    /**
     * Change from one plan to another.
     * Clears the cache of the subscription.
     */
    public change(subscription: Subscription, plan: Plan): void {
        this.subscriptions
            .change(subscription, plan)
            .subscribe(
                (response: SubscriptionResponse) => {
                    alert('Changed plans!');
                    this.router.navigate(['/'], { relativeTo: this.route });
                },
                (error: SubscriptionResponse) => {
                    console.error(error);
                    alert('An error occurred.');
                },
            );
    }

    /**
     * Unsubscribe from a given subscription.
     * Clears the cache of the subscription.
     */
    public delete(subscription: Subscription): void {
        this.subscriptions
            .delete(subscription)
            .subscribe(
                (response: SubscriptionResponse) => {
                    alert('Unsubscribed!');
                    this.router.navigate(['/'], { relativeTo: this.route });
                },
                (error: SubscriptionResponse) => {
                    console.error(error);
                    alert('An error occurred.');
                },
            );
    }
}
