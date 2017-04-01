import { Injectable, Inject } from '@angular/core';
import { utc } from 'moment';
import { HttpService } from '@freescan/http';
import {
    FREESCAN_ENV,
    Environment,
    Subscription,
    SubscriptionResponse,
    Plan,
} from '@freescan/skeleton';
import { Observable } from 'rxjs';


@Injectable()
export class SubscriptionService {
    public cashier: string = '';

    constructor(private http: HttpService,
                @Inject(FREESCAN_ENV) private environment: Environment) {
        this.cashier = environment.api.cashier;
    }

    /**
     * Request the subscriptions for the given user.
     * Always request these (no cache) since they could change at any point.
     */
    public all(userId: string): Observable<Subscription[]> {
        return this.http
            .hostname(this.cashier)
            .get(`users/${userId}/subscriptions?includes=plan`)
            .map((response: SubscriptionResponse): Subscription[] => response.data);
    }

    /**
     * Subscribe with the Stripe token!
     */
    public subscribe(token: string, plan: Plan): Observable<SubscriptionResponse> {
        return this.http
            .hostname(this.cashier)
            .post('subscriptions', { gateway_token: token, plan_id: plan.id });
    }

    /**
     * Change from one plan to another.
     */
    public change(subscription: Subscription, plan: Plan): Observable<SubscriptionResponse> {
        return this.http
            .patch(`subscriptions/${subscription.id}`, {
                plan_id: plan.id,
            });
    }

    /**
     * Unsubscribe to a given subscription.
     */
    public delete(subscription: Subscription): Observable<SubscriptionResponse> {
        return this.http.delete(`subscriptions/${subscription.id}`);
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
