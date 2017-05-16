import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, SubscriptionService, SubscriptionResponse } from '@freescan/skeleton';

import { StripeResponse } from '../+models';
import { ModalService } from '../+services/modal.service';
import { StripeService } from '../+services/stripe.service';
import { PlanService } from '../+services/plan.service';


@Component({
    selector:    'studio-billing-payment',
    templateUrl: './payment.component.html',
    styleUrls:   ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
    public disabled: boolean   = true;
    public submitting: boolean = false;
    public complete: boolean   = false;
    public errors: string      = '';

    constructor(private router: Router,
                private modal: ModalService,
                private alerts: AlertService,
                public stripe: StripeService,
                public plans: PlanService,
                public subscriptions: SubscriptionService) {
    }

    public ngOnInit(): void {
        this.modal.title = 'Enter Payment Information';

        if (this.ready()) {
            this.mountCardElement();
        }
    }

    /**
     * Submit the form and payment information directly to Stripe.
     * It is important to catch errors in this process.
     */
    public subscribe(): void {
        if (this.disabled || !this.plans.plan) {
            return;
        }

        this.submitting = true;
        this.stripe
            .createToken()
            .then((result: StripeResponse) => {
                if (result.error) {
                    this.error(result.error.message);
                    return;
                }

                // Subscribe!
                this.subscriptions
                    .subscribe(result.token.id, this.plans.plan)
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
        if (!this.stripe.elements || !this.plans.plan) {
            this.router.navigate([], { queryParams: { module: 'billing', step: 'intro' } });
            return false;
        }

        return true;
    }

    /**
     * Mount the credit card form, attach it to the DOM, and watch for error messages.
     */
    private mountCardElement(): void {
        this.stripe.cardElement.mount('#card-element');
        this.stripe.cardElement.on('change', (event: StripeResponse) => {
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
        this.alerts.success(
            'Payment successful!',
            'We are activating your account. If your reports are not immediately available, please refresh and try again.',
        );
        this.router.navigate([], { queryParams: {} });
    }

    /**
     * Show error messages from Stripe to the user.
     */
    private error(message: string): void {
        this.submitting = false;
        this.errors     = '';
        this.errors     = message;
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
