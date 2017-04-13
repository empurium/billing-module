import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { Subscription } from '../+models';
import { ModalService } from '../+services/modal.service';
import { SubscriptionService } from '../+services/subscription.service';
import { StripeService } from '../+services/stripe.service';


@Component({
    selector:    'freescan-billing-modal',
    templateUrl: './modal.component.html',
    styleUrls:   ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, AfterViewInit {
    @ViewChild('billingModal') public billingModal: ModalDirective;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private stripe: StripeService,
                private subscriptions: SubscriptionService,
                public modal: ModalService) {
    }

    /**
     * Show the appropriate route depending on whether the user
     * has current subscriptions.
     */
    public ngOnInit(): void {
        this.stripe.configure(() => {
            this.navigate();
        });
    }

    /**
     * Automatically open the Billing modal after it has loaded.
     */
    public ngAfterViewInit(): void {
        if (!this.billingModal.isShown) {
            this.billingModal.config.ignoreBackdropClick = true;
            this.billingModal.show();
        }
    }

    /**
     * Start the wizard with the appropriate first route depending
     * on whether the user has current subscriptions.
     */
    public navigate(): void {
        this.subscriptions
            .all()
            .filter((subscriptions: Subscription[], idx: number): boolean => {
                if (subscriptions === null) {
                    return true;
                }

                return !this.subscriptions.ended(subscriptions[idx].ends_at);
            })
            .subscribe(
                (subscriptions: Subscription[]) => {
                    if (subscriptions && subscriptions.length) {
                        this.router.navigate(['subscriptions'], { relativeTo: this.route });
                        return;
                    }

                    this.router.navigate(['plans'], { relativeTo: this.route });
                },
                (error: string): void => {
                    this.router.navigate(['plans'], { relativeTo: this.route });
                },
            );
    }

    /**
     * Close the modal and navigate to the parent.
     */
    public cancel(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}
