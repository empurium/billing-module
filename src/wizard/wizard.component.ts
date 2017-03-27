import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'freescan-wizard',
    template: `<router-outlet></router-outlet>`,
})
export class WizardComponent implements OnInit {
    constructor(private route: ActivatedRoute,
                private router: Router) {
    }

    public ngOnInit(): void {
        this.start();
    }

    /**
     * Start the wizard with the first route.
     */
    public start(): void {
        if (!this.route.firstChild) {
            this.router.navigate([''], { relativeTo: this.route });
        }
    }
}
