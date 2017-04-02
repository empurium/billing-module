import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Plan } from '@freescan/skeleton';

import { ModalService } from '../+services/modal.service';
import { PlanService } from '../+services/plan.service';


@Component({
    selector:    'freescan-plans',
    templateUrl: './plans.component.html',
    styleUrls:   ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
    private cardWidth: number = 4;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private modal: ModalService,
                public plans: PlanService) {
    }

    public ngOnInit(): void {
        this.modal.title = 'Pick Your Plan';

        this.getPlans();
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
    public continue(): void {
        this.router
            .navigate(['payment-information'], { relativeTo: this.route.parent })
            .catch((error: Error) => console.error(error));
    }

    /**
     * Grid columns based on the number of plans. To center the Continue button accordingly.
     */
    public grid(): string {
        return 'col-md-' + (this.plans.plans ? (this.plans.plans.length * this.cardWidth) : 12);
    }

    /**
     * Get the available Plans.
     * Automatically select the first plan until we have Defaults.
     */
    private getPlans(): void {
        this.plans
            .all()
            .subscribe(
                (plans: Plan[]) => {
                    if (plans && plans.length) {
                        this.plans.plan = plans[0];
                    }
                },
                (error: string) => console.error(error),
            );
    }
}
