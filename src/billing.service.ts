import { Injectable, Inject } from '@angular/core';
import { HttpService } from '@freescan/http';
import {
    FREESCAN_ENV,
    Environment,
    StripeResponse,
    Gateway,
    GatewayResponse,
    Subscription,
    SubscriptionResponse,
    Plan,
    PlanResponse,
} from '@freescan/skeleton';
import { Observable } from 'rxjs';

import { gatewayId, stripeStyles } from './configuration';

@Injectable()
export class BillingService {
    public cashierUrl: string = '';
    public gatewayId: string  = gatewayId;

    // Stripe.js API
    public stripe: any;
    public stripeElements: any;

    // Cache these in BillingService instance
    public gateway: Gateway;
    public subscriptions: Subscription[] = [];
    public plans: Plan[]                 = [];

    // Selected plan
    public plan: Plan;

    // Stripe does not allow recreating Card elements when Components reinitialize
    public cardElement: any;
    public formReady: boolean = false;

    constructor(private http: HttpService,
                @Inject(FREESCAN_ENV) private environment: Environment) {
        this.configure(this.environment);
    }

    /**
     * Configure the BillingService Stripe instance using the Gateway ID from the API.
     * Supports a callback if timing is necessary after instantiating Stripe.
     *
     * Note: You will need to have Stripe's js available on the client.
     */
    public configureStripe(stripe: any, callback?: Function): void {
        this.getGateway()
            .subscribe((gateway: Gateway) => {
                this.stripe         = stripe(gateway.key);
                this.stripeElements = this.stripe.elements();
                this.formReady      = true;

                if (typeof callback === 'function') {
                    callback(gateway);
                }
            });
    }

    /**
     * Request the Gateway information for the Stripe key.
     */
    public getGateway(): Observable<Gateway> {
        if (this.gateway && this.gateway.key) {
            return Observable.of(this.gateway);
        }

        return this.http
            .hostname(this.cashierUrl)
            .get(`gateways/${this.gatewayId}`)
            .map((response: GatewayResponse) => {
                this.gateway = response.data;
                return response.data;
            });
    }

    /**
     * Request the available plans.
     */
    public getPlans(): Observable<Plan[]> {
        if (this.plans && this.plans.length) {
            return Observable.of(this.plans);
        }

        return this.http
            .hostname(this.cashierUrl)
            .get('plans')
            .map((response: PlanResponse) => {
                this.plans = response.data;
                return response.data;
            });
    }

    /**
     * Request the active subscriptions for the given user.
     * Always request these (no cache) since they could change at any point.
     */
    public getSubscriptions(userId: string): Observable<Subscription[]> {
        if (this.subscriptions && this.subscriptions.length) {
            return Observable.of(this.subscriptions);
        }

        return this.http
            .hostname(this.cashierUrl)
            .get(`users/${userId}/subscriptions?includes=plan`)
            .map((response: SubscriptionResponse) => {
                this.subscriptions = response.data;
                return response.data;
            });
    }

    /**
     * Unsubscribe to a given subscription.
     */
    public deleteSubscription(subscription: Subscription): Observable<SubscriptionResponse> {
        return this.http.delete(`subscriptions/${subscription.id}`);
    }

    /**
     * Pay with the Stripe token!
     */
    public pay(token: string): Observable<SubscriptionResponse> {
        return this.http
            .hostname(this.cashierUrl)
            .post('subscriptions', { plan_id: this.plan.id, gateway_token: token });
    }

    /**
     * Create a Stripe token.
     */
    public createToken(): Promise<StripeResponse> {
        return this.stripe.createToken(this.cardElement);
    }

    /**
     * Use Stripe's beautiful credit card input form.
     * Consumer is responsible for using cardElement.mount() to the appropriate element.
     */
    public createCardElement(): void {
        if (!this.cardElement) {
            this.cardElement = this.stripeElements.create('card', { style: stripeStyles });
        }
    }

    /**
     * Configure the BillingService.
     */
    private configure(environment: Environment): void {
        this.cashierUrl = environment.api.cashier;
    }
}
