import { Injectable, Inject } from '@angular/core';
import { HttpService } from '@rndstudio/http';
import { FREESCAN_ENV, Environment, Plan, PlanResponse } from '@rndstudio/skeleton';
import { Observable } from 'rxjs';


@Injectable()
export class PlanService {
    public cashier: string = '';

    // Cache
    public plans: Plan[] = [];

    // Selected plan
    public plan: Plan;

    constructor(private http: HttpService,
                @Inject(FREESCAN_ENV) private environment: Environment) {
        this.cashier = environment.api.cashier;
    }

    /**
     * Request the available plans.
     */
    public all(): Observable<Plan[]> {
        if (this.plans && this.plans.length) {
            return Observable.of(this.plans);
        }

        return this.http
            .hostname(this.cashier)
            .get('plans')
            .map((response: PlanResponse) => {
                this.plans = response.data;
                return response.data;
            });
    }
}
