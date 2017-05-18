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
    public loading: boolean   = true;
    public plans: Plan[]      = [];
    private cardWidth: number = 4;

    constructor(private router: Router,
                private modalService: ModalService,
                public planService: PlanService) {
    }

    public ngOnInit(): void {
        this.modalService.title = 'Pick Your Plan';
        this.getPlans();
    }

    /**
     * Request the list of plans for this white label. Should already be cached.
     */
    public getPlans(): void {
        this.planService.all().subscribe(
            (plans: Plan[]) => {
                this.plans   = plans;
                this.loading = false;
            },
        );
    }

    /**
     * Test whether or not the given Plan is currently selected.
     */
    public selected(plan: Plan): boolean {
        return this.planService.plan ? this.planService.plan.id === plan.id : false;
    }

    /**
     * Select a given Plan.
     */
    public select(plan: Plan): void {
        this.planService.plan = plan;
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
        return 'col-md-' + (this.planService.plans ? (this.planService.plans.length * this.cardWidth) : 12);
    }

    /**
     * Return true if there is only one plan.
     */
    public single(): boolean {
        return this.planService && this.planService.plans && this.planService.plans.length === 1;
    }
}
