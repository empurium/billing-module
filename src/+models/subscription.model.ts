import { Response } from './response.model';
import { Plan } from './plan.model';

export class Subscription {
    public id: string;
    public name: string;
    public card_brand: string;
    public card_expiration_date: string;
    public card_last_four: string;
    public ends_at: string;
    public trial_ends_at: string;
    public plan: {
        data: Plan;
    };
}

export class SubscriptionResponse extends Response {
    public data: Subscription[];
}
