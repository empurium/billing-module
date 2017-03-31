import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StripeResponse, SubscriptionResponse } from '@freescan/skeleton';

import { BillingService } from '../billing.service';


@Component({
    selector:    'freescan-payment',
    templateUrl: './payment.component.html',
    styleUrls:   ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
    private disabled: boolean   = true;
    private submitting: boolean = false;
    private complete: boolean   = false;
    private errors: string      = '';

    constructor(private route: ActivatedRoute,
                private router: Router,
                public billing: BillingService) {
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
        if (this.disabled) {
            return;
        }

        this.submitting = true;
        this.billing
            .createToken()
            .then((result: StripeResponse) => {
                if (result.error) {
                    this.error(result.error.message);
                    return;
                }

                // Subscribe!
                this.billing
                    .pay(result.token.id)
                    .subscribe(
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
        if (!this.billing.stripeElements || !this.billing.plan) {
            this.router.navigate(['../'], { relativeTo: this.route });
            return false;
        }

        return true;
    }

    /**
     * Create the credit card form, attach it to the DOM, and watch for error messages.
     */
    private createCardElement(): void {
        this.billing.createCardElement();
        this.billing.cardElement.mount('#card-element');
        this.billing.cardElement.on('change', (event: StripeResponse) => {
            this.complete = event.complete;

            if (event.error) {
                this.error(event.error.message);
                return;
            }

            this.error('');
            this.checkSubmittable();
        });
    }

    /**
     * Handle successful payments/subscriptions.
     */
    private success(response: SubscriptionResponse): void {
        this.submitting = false;
        this.router.navigate(['/']);
    }

    /**
     * Show error messages from Stripe to the user.
     */
    private error(message: string): void {
        this.errors = '';
        this.errors = message;
    }

    /**
     * Whether or not the form is ready to be submitted.
     */
    private checkSubmittable(): void {
        if (!this.submitting && this.errors === '' && this.complete) {
            this.disabled = false;
            return;
        }

        this.disabled = true;
    }
}
