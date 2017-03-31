import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Plan } from '@freescan/skeleton';

import { BillingService } from '../billing.service';

@Component({
    selector:    'freescan-plans',
    templateUrl: './plans.component.html',
    styleUrls:   ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
    private cardWidth: number = 4;

    constructor(private route: ActivatedRoute,
                private router: Router,
                public billing: BillingService) {
    }

    public ngOnInit(): void {
        this.getPlans();
    }

    /**
     * Test whether or not the given Plan is currently selected.
     */
    public selected(plan: Plan): boolean {
        return this.billing.plan ? this.billing.plan.id === plan.id : false;
    }

    /**
     * Select a given Plan.
     */
    public select(plan: Plan): void {
        this.billing.plan = plan;
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
        return 'col-md-' + (this.billing.plans ? (this.billing.plans.length * this.cardWidth) : 12);
    }

    /**
     * Get the available Plans.
     */
    private getPlans(): void {
        this.billing
            .getPlans()
            .subscribe(
                (plans: Plan[]) => {
                    // Automatically select the first plan until we have Defaults
                    if (plans && plans.length) {
                        this.billing.plan = plans[0];
                    }
                },
                (error: string) => console.error(error),
            );
    }
}
