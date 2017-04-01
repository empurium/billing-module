import { Injectable, Inject } from '@angular/core';
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

    // Cache
    public subscriptions: Subscription[] = [];

    constructor(private http: HttpService,
                @Inject(FREESCAN_ENV) private environment: Environment) {
        this.cashier = environment.api.cashier;
    }

    /**
     * Request the subscriptions for the given user.
     * Always request these (no cache) since they could change at any point.
     */
    public all(userId: string): Observable<Subscription[]> {
        if (this.subscriptions && this.subscriptions.length) {
            return Observable.of(this.subscriptions);
        }

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
            .post('subscriptions', { gateway_token: token, plan_id: plan.id })
            .finally(() => this.bust());
    }

    /**
     * Change a given subscription from its current plan to another.
     */
    public change(subscription: Subscription, plan: Plan): Observable<SubscriptionResponse> {
        return this.http
            .patch(`subscriptions/${subscription.id}`, {
                plan_id: plan.id,
            })
            .finally(() => this.bust());
    }

    /**
     * Unsubscribe to a given subscription.
     */
    public delete(subscription: Subscription): Observable<SubscriptionResponse> {
        return this.http
            .delete(`subscriptions/${subscription.id}`)
            .finally(() => this.bust());
    }

    /**
     * Bust the instance cache of the subscriptions to force refresh.
     */
    public bust(): void {
        this.subscriptions = [];
    }
}
