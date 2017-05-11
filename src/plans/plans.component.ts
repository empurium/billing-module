import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plan } from '@freescan/skeleton';

import { ModalService } from '../+services/modal.service';
import { PlanService } from '../+services/plan.service';


@Component({
    selector:    'studio-billing-plans',
    templateUrl: './plans.component.html',
    styleUrls:   ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
    private cardWidth: number = 4;

    constructor(private router: Router,
                private modal: ModalService,
                public plans: PlanService) {
    }

    public ngOnInit(): void {
        this.modal.title = 'Pick Your Plan';
    }

    /**
     * Test whether or not the given Plan is currently selected.
     */
    public selected(plan: Plan): boolean {
        return this.plans.plan ? this.plans.plan.id === plan.id : false;
    }

    /**
     * Select a given Plan.
     */
    public select(plan: Plan): void {
        this.plans.plan = plan;
    }

    /**
     * Begin the payment process.
     */
    public continue(plan: Plan): void {
        this.select(plan);
        this.router
            .navigate([], { queryParams: { module: 'billing', step: 'payment' } })
            .catch((error: Error) => console.error(error));
    }

    /**
     * Grid columns based on the number of plans. To center the Continue button accordingly.
     */
    public grid(): string {
        return 'col-md-' + (this.plans.plans ? (this.plans.plans.length * this.cardWidth) : 12);
    }

    /**
     * Return true if there is only one plan.
     */
    public single(): boolean {
        return !!(this.plans && this.plans.plans && this.plans.plans.length === 1);
    }
}
