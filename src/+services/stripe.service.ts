import { Injectable, Inject } from '@angular/core';
import {
    FREESCAN_ENV,
    Environment,
    StripeResponse,
    Gateway,
} from '@freescan/skeleton';

import { stripeStyles } from '../configuration';
import { GatewayService } from './gateway.service';


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
                @Inject(FREESCAN_ENV) private environment: Environment) {
        this.cashier = environment.api.cashier;
    }

    /**
     * Configure the Stripe instance using the Gateway ID from the API.
     * Supports a callback if timing is necessary after instantiating Stripe.
     *
     * Note: You will need to have Stripe's js available on the client.
     */
    public configure(stripe: any, callback?: Function): void {
        if (this.stripe) {
            return;
        }

        this.gateways.one()
            .subscribe((gateway: Gateway): void => {
                this.stripe    = stripe(gateway.key);
                this.elements  = this.stripe.elements();
                this.formReady = true;

                if (typeof callback === 'function') {
                    callback(gateway);
                }
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
