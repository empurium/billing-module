import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from '@rndstudio/skeleton';

import { StripeService } from '../+services/stripe.service';


@Component({
    selector:    'studio-billing-button',
    templateUrl: './billing-button.component.html',
    styleUrls:   ['./billing-button.component.scss'],
})
export class BillingButtonComponent implements OnInit {
    public disabled: boolean = true;
    public label: string     = 'Loading...';
    public step: string      = 'subscriptions';

    constructor(private router: Router,
                private stripe: StripeService) {
    }

    public ngOnInit(): void {
        this.stripe.configure((subscriptions: Subscription[]|null) => {
            this.disabled = false;

            if (subscriptions && subscriptions.length) {
                this.step  = 'subscriptions';
                this.label = 'Manage Subscription';
                return;
            }

            this.step  = 'intro';
            this.label = 'Become a Subscriber';
        });
    }

    public open(): void {
        this.router.navigate([], {
            queryParams: {
                module: 'billing',
                step:   this.step,
            },
        });
    }
}
