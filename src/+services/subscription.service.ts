import { Injectable, Inject } from '@angular/core';
import { utc } from 'moment';
import { HttpService } from '@freescan/http';
import { FREESCAN_ENV, Environment, AuthenticationService } from '@freescan/skeleton';
import { Observable } from 'rxjs';

import { Subscription, SubscriptionResponse, Plan } from '../+models';


@Injectable()
export class SubscriptionService {
    public cashier: string = '';

    // Cache
    public subscriptions: Subscription[];

    constructor(private http: HttpService,
                private authentication: AuthenticationService,
                @Inject(FREESCAN_ENV) private environment: Environment) {
        this.cashier = environment.api.cashier;
    }

    /**
     * Request the subscriptions for the given user. Default to current user.
     * Always request these (no cache) since they could change at any point.
     */
    public all(userId?: string): Observable<Subscription[]> {
        userId = userId || this.authentication.userId();

        if (!userId) {
            return Observable.of([]);
        }

        if (this.subscriptions || this.subscriptions === null) {
            return Observable.of(this.subscriptions);
        }

        return this.http
            .hostname(this.cashier)
            .get(`users/${userId}/subscriptions?includes=plan`)
            .map((response: SubscriptionResponse): Subscription[] => {
                this.subscriptions = response.data;
                return response.data;
            })
            .finally(() => {
                this.subscriptions = this.subscriptions || null;
            });
    }

    /**
     * Subscribe with the Stripe token!
     */
    public subscribe(token: string, plan: Plan): Observable<SubscriptionResponse> {
        return this.http
            .hostname(this.cashier)
            .post('subscriptions', { gateway_token: token, plan_id: plan.id })
            .finally(() => this.forget());
    }

    /**
     * Reactivate a subscription.
     */
    public reactivate(plan: Plan): Observable<SubscriptionResponse> {
        return this.http
            .hostname(this.cashier)
            .post('subscriptions', { plan_id: plan.id })
            .finally(() => this.forget());
    }

    /**
     * Change a given subscription from its current plan to another.
     */
    public change(subscription: Subscription, plan: Plan): Observable<SubscriptionResponse> {
        return this.http
            .patch(`subscriptions/${subscription.id}`, {
                plan_id: plan.id,
            })
            .finally(() => this.forget());
    }

    /**
     * Unsubscribe to a given subscription.
     */
    public delete(subscription: Subscription): Observable<SubscriptionResponse> {
        return this.http
            .delete(`subscriptions/${subscription.id}`)
            .finally(() => this.forget());
    }

    /**
     * Forget the client-side cache of the subscriptions to force refresh.
     */
    public forget(): void {
        delete this.subscriptions;
    }

    /**
     * True if the current time in UTC is after the given end time, aka not yet ended.
     * Both are converted to UTC.
     */
    public ended(endsAt?: string): boolean {
        if (!endsAt) {
            return false;
        }

        return utc().isAfter(utc(endsAt));
    }
}
