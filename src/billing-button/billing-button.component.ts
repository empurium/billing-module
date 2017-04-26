import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StripeService } from '../+services/stripe.service';


@Component({
    selector:    'studio-billing-button',
    templateUrl: './billing-button.component.html',
    styleUrls:   ['./billing-button.component.scss'],
})
export class BillingButtonComponent implements OnInit {
    public disabled: boolean = true;
    public label: string     = 'Loading...';

    constructor(private router: Router,
                private stripe: StripeService) {
    }

    public ngOnInit(): void {
        this.stripe.configure(() => {
            this.disabled = false;
            this.label    = 'Manage Billing';
        });
    }

    public open(): void {
        this.router.navigate([], {
            queryParams: {
                module: 'billing',
                step:   'subscriptions',
            },
        });
    }
}
