import { Injectable } from '@angular/core';
import { HttpService } from '@freescan/http';
import { StripeResponse, GatewayResponse, PlanResponse, SubscriptionResponse, Plan } from '@freescan/skeleton';
import { Observable } from 'rxjs';

import { gatewayId, stripeStyles } from './configuration';

@Injectable()
export class BillingService {
    public cashierUrl: string = '';
    public gatewayId: string  = gatewayId;
    public stripe: any;
    public stripeElements: any;

    // Available / Chosen Plan
    public plans: Plan[] = [];
    public plan: Plan;

    // Stripe does not allow recreating Card elements when Components reinitialize
    public cardElement: any;
    public formReady: boolean = false;

    constructor(private http: HttpService) {
    }

    /**
     * Configure the BillingService with a Cashier API URL, set up Stripe, etc.
     * Supports a callback if timing is necessary after instantiating Stripe.
     *
     * Note: You will need to have Stripe's js available on the client.
     */
    public configure(stripe: any, cashierUrl: string, callback?: Function): void {
        this.cashierUrl = cashierUrl;

        this.gateways()
            .subscribe((gateway: GatewayResponse) => {
                this.stripe         = stripe(gateway.data.key);
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
    public gateways(): Observable<GatewayResponse> {
        return this.http
            .hostname(this.cashierUrl)
            .get(`gateways/${this.gatewayId}`);
    }

    /**
     * Request the available plans.
     */
    public getPlans(): void {
        if (this.plans && this.plans.length) {
            return;
        }

        this.http
            .hostname(this.cashierUrl)
            .get('plans')
            .subscribe(
                (response: PlanResponse) => {
                    if (response.data && response.data.length) {
                        this.plan = response.data[0];
                    }
                    this.plans = response.data;
                },
                (error: PlanResponse) => console.error(error),
            );
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
}
