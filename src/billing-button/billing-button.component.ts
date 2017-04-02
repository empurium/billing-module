import { Component, OnInit } from '@angular/core';

import { StripeService } from '../+services/stripe.service';


@Component({
    selector: 'freescan-billing-button',
    template: `<button routerLink="billing" [disabled]="disabled" class="btn btn-secondary btn-pointer">{{ label }}</button>`,
    styleUrls: ['./billing-button.component.scss'],
})
export class BillingButtonComponent implements OnInit {
    public disabled: boolean = true;
    public label: string = 'Loading...';

    constructor(private stripe: StripeService) {
    }

    public ngOnInit(): void {
        this.stripe.configure(() => {
            this.disabled = false;
            this.label = 'Manage Billing';
        });
    }
}
