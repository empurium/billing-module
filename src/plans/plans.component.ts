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
                private billingService: BillingService) {
    }

    public ngOnInit(): void {
        this.billingService.getPlans();
    }

    /**
     * Test whether or not the given Plan is currently selected.
     */
    public selected(plan: Plan): boolean {
        return this.billingService.plan ? this.billingService.plan.id === plan.id : false;
    }

    /**
     * Select a given Plan.
     */
    public select(plan: Plan): void {
        this.billingService.plan = plan;
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
        return 'col-md-' + (this.billingService.plans ? (this.billingService.plans.length * this.cardWidth) : 12);
    }
}
