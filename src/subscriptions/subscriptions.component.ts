import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, SubscriptionService, Plan, Subscription, SubscriptionResponse } from '@rndstudio/skeleton';

import { ModalService } from '../+services/modal.service';
import { PlanService } from '../+services/plan.service';


@Component({
    selector:    'studio-billing-subscriptions',
    templateUrl: './subscriptions.component.html',
    styleUrls:   ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
    constructor(private router: Router,
                private modal: ModalService,
                private alerts: AlertService,
                public subscriptions: SubscriptionService,
                public plans: PlanService) {
    }

    public ngOnInit(): void {
        this.modal.title = 'Current Subscriptions';
    }

    /**
     * Navigate to the list of Plans.
     */
    public viewPlans(): void {
        this.router.navigate([], {
            queryParams: { module: 'billing', step: 'plans' },
        });
    }

    /**
     * Return the status of a given Subscription.
     */
    public status(type: string, subscription: Subscription): boolean {
        switch (type) {
        case 'active':
            return !subscription.ends_at;
        case 'ending-soon':
            return subscription.ends_at && !this.subscriptions.ended(subscription.ends_at);
        case 'ended':
            return subscription.ends_at && this.subscriptions.ended(subscription.ends_at);
        default:
        }
    }

    /**
     * Reactivate a given plan.
     */
    public reactivate(plan: Plan): void {
        this.subscriptions
            .reactivate(plan)
            .subscribe(
                (response: SubscriptionResponse) => {
                    this.alerts.success('Subscription reactivated.', 'Welcome back!');
                    this.router.navigate([], { queryParams: {} });
                },
                (error: any) => {
                    this.alerts.errorMessage(error);
                },
            );
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
                    this.alerts.success('Plan changed successfully.', null);
                    this.router.navigate([], { queryParams: {} });
                },
                (error: any) => {
                    this.alerts.errorMessage(error);
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
                    this.alerts.info('Unsubscribed.', 'You will no longer be billed for this subscription.');
                    this.router.navigate([], { queryParams: {} });
                },
                (error: any) => {
                    this.alerts.errorMessage(error);
                },
            );
    }
}
