import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { ModalService } from '../+services/modal.service';
import { StripeService } from '../+services/stripe.service';


@Component({
    selector:    'studio-billing-modal',
    templateUrl: './modal.component.html',
    styleUrls:   ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
    @Input() public intro: string = '';
    @ViewChild('billingModal') public billingModal: ModalDirective;
    private step: string = 'intro';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private stripe: StripeService,
                private modalService: ModalService) {
    }

    public ngOnInit(): void {
        this.stripe.configure();
        this.watchRoute();
        this.watchEvents();
        this.modalService.intro = this.intro;
    }

    /**
     * Show the billing modal when we see the correct query parameter.
     * Allows us to act like a proper modal that can be on any URL.
     */
    public watchRoute(): void {
        this.route
            .queryParams
            .map((params: Params) => {
                this.modalService.promotion = '';
                if (params['promotion'] === 'realvision') {
                    this.modalService.promotion = params['promotion'];
                }

                if (params['module'] !== 'billing') {
                    this.close();
                }
                if (params['module'] === 'billing') {
                    this.show();
                }
                if (params['step']) {
                    this.step = params['step'];
                }
            })
            .subscribe();
    }

    /**
     * Show the billing modal when an event tells us to.
     */
    public watchEvents(): void {
        this.modalService.events.subscribe((name: string): void => {
            if (name === 'show') {
                this.show();
            }
            if (name === 'close') {
                this.close();
            }
        });
    }

    /**
     * Return whether or not we are on a given step.
     * Used to render appropriate component.
     */
    public onStep(step: string): boolean {
        return this.step === step;
    }

    /**
     * Return the step number the user is on.
     */
    public stepNumber(): number {
        switch (this.step) {
            case 'intro':
                return 1;
            case 'plans':
                return 2;
            case 'payment':
                return 3;
        }
    }

    /**
     * Retrieve the modal title from the ModalService.
     */
    public title(): string {
        return this.modalService.title;
    }

    /**
     * Show the modal if it's not already visible.
     */
    public show(): void {
        if (!this.billingModal.isShown) {
            this.billingModal.config = this.billingModal.config || {};
            this.billingModal.config.ignoreBackdropClick = true;
            this.billingModal.config.keyboard = false;
            this.billingModal.show();
        }
    }

    /**
     * Close the modal and remove the query param.
     */
    public close(): void {
        if (this.billingModal && this.billingModal.isShown) {
            this.router.navigate([], { queryParams: {} });
            this.billingModal.hide();
        }
    }
}
