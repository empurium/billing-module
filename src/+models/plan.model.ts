import { Response } from '@freescan/skeleton';

export class Plan {
    public id: string;
    public name: string;
    public period: string;
    public price: string;
}

export class PlanResponse extends Response {
    public data: Plan[];
}
