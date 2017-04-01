import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from '@freescan/skeleton';

import { SubscriptionService } from '../+services/subscription.service';


@Component({
    selector: 'freescan-wizard',
    template: `<router-outlet></router-outlet>`,
})
export class WizardComponent implements OnInit {
    constructor(private route: ActivatedRoute,
                private router: Router,
                private subscriptions: SubscriptionService) {
    }

    public ngOnInit(): void {
        this.navigate();
    }

    /**
     * Start the wizard with the appropriate first route depending
     * on whether the user has current subscriptions.
     */
    public navigate(): void {
        this.subscriptions
            .all()
            .filter((subscriptions: Subscription[], idx: number): boolean => {
                return !this.subscriptions.ended(subscriptions[idx].ends_at);
            })
            .subscribe(
                (subscriptions: Subscription[]) => {
                    this.subscriptions.subscriptions = subscriptions;
                    this.router.navigate(['subscriptions'], { relativeTo: this.route });
                },
                (error: string): void => {
                    this.router.navigate(['plans'], { relativeTo: this.route });
                },
            );
    }
}
