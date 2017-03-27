import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StripeResponse, SubscriptionResponse } from '@freescan/skeleton';

import { BillingService } from '../billing.service';


@Component({
    selector:    'freescan-payment',
    templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
    private cardErrors: string = '';
    private submitting: boolean = false;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private billingService: BillingService) {
    }

    public ngOnInit(): void {
        if (this.ready()) {
            this.createCardElement();
        }
    }

    /**
     * Submit the form and payment information directly to Stripe.
     * It is important to catch errors in this process.
     */
    public subscribe(): void {
        if (this.submitting) {
            return;
        }

        this.submitting = true;
        this.billingService
            .createToken()
            .then((result: StripeResponse) => {
                if (result.error) {
                    this.error(result.error.message);
                    return;
                }

                // Subscribe!
                this.billingService.pay(result.token.id).subscribe(
                    (response: SubscriptionResponse) => this.success(response),
                    (error: Error) => this.error(error.message),
                );
            })
            .catch((error: any) => {
                this.error(error);
            });
    }

    /**
     * Redirect the user if they land directly on the Payment form URL when it is not ready.
     */
    private ready(): boolean {
        if (!this.billingService.stripeElements || !this.billingService.formReady || !this.billingService.plan) {
            this.router.navigate(['../'], { relativeTo: this.route });
            return false;
        }

        return true;
    }

    /**
     * Create the credit card form, attach it to the DOM, and watch for error messages.
     */
    private createCardElement(): void {
        this.billingService.createCardElement();
        this.billingService.cardElement.mount('#card-element');
        this.billingService.cardElement.on('change', (event: StripeResponse) => {
            if (event.error) {
                this.error(event.error.message);
            }
        });
    }

    /**
     * Handle successful payments/subscriptions.
     */
    private success(response: SubscriptionResponse): void {
        console.log(response.message);
        this.router.navigate(['/']);
    }

    /**
     * Show error messages from Stripe to the user.
     */
    private error(message: string): void {
        this.cardErrors = '';
        this.cardErrors = message;
    }
}
