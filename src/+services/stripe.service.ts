import { Injectable, Inject } from '@angular/core';
import { FREESCAN_ENV, Environment, SubscriptionService } from '@rndstudio/skeleton';

import { stripeStyles } from '../configuration';
import { StripeResponse, Gateway } from '../+models';
import { GatewayService } from './gateway.service';
import { PlanService } from './plan.service';

import { Subscription } from '@rndstudio/skeleton';


@Injectable()
export class StripeService {
    public cashier: string = '';

    // Stripe.js API
    public stripe: any;
    public elements: any;

    // Stripe does not allow recreating Card elements when Components reinitialize
    public cardElement: any;
    public formReady: boolean = false;

    constructor(private gateways: GatewayService,
                private subscriptions: SubscriptionService,
                private plans: PlanService,
                @Inject(FREESCAN_ENV) private environment: Environment) {
        this.cashier = environment.api.cashier;
    }

    /**
     * Configure the Stripe instance using the Gateway ID from the API.
     *
     * Pre-fetch the Subscriptions/Plans and set up the Stripe credit card form
     * so the subscription management/payment funnel is very fast.
     *
     * Note: You will need to have Stripe's js loaded on the client.
     */
    public configure(callback?: Function): void {
        const stripe: any = window['Stripe'];

        // Pre-fetch Subscriptions
        this.subscriptions.all().subscribe(
            (subscriptions: Subscription[]|null) => {
                if (typeof callback === 'function') {
                    callback(subscriptions);
                }
            },
            () => {
                if (typeof callback === 'function') {
                    callback(null);
                }
            },
        );

        // Pre-fetch Plans
        this.plans.all().subscribe(
            () => {
                // Client cache warmed
            },
        );

        if (this.stripe || !stripe) {
            return;
        }

        // Configure Stripe client
        this.gateways.one()
            .subscribe((gateway: Gateway): void => {
                this.stripe    = stripe(gateway.key);
                this.elements  = this.stripe.elements();
                this.createCardElement();
                this.formReady = true;
            });
    }

    /**
     * Use Stripe's beautiful credit card input form.
     * Consumer is responsible for using cardElement.mount() to the appropriate element.
     */
    public createCardElement(): void {
        if (!this.cardElement) {
            this.cardElement = this.elements.create('card', { style: stripeStyles });
        }
    }

    /**
     * Create a Stripe token from the cardElement to be used for payment.
     */
    public createToken(): Promise<StripeResponse> {
        return this.stripe.createToken(this.cardElement);
    }
}
