import { Component, OnInit } from '@angular/core';

import { StripeService } from '../+services/stripe.service';
import { ModalService } from '../+services/modal.service';


@Component({
    selector: 'studio-billing-button',
    template: `<button (click)="open()" [disabled]="disabled" class="btn btn-secondary btn-pointer">{{ label }}</button>`,
    styleUrls: ['./billing-button.component.scss'],
})
export class BillingButtonComponent implements OnInit {
    public disabled: boolean = true;
    public label: string = 'Loading...';

    constructor(private stripe: StripeService,
                private modalService: ModalService) {
    }

    public ngOnInit(): void {
        this.stripe.configure(() => {
            this.disabled = false;
            this.label = 'Manage Billing';
        });
    }

    public open(): void {
        this.modalService.events.emit('show');
    }
}
