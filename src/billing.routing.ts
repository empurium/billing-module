import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { PlansComponent } from './plans/plans.component';
import { PaymentComponent } from './payment/payment.component';

export const billingRoutes: Routes = [
    {
        path:      'subscriptions',
        component: SubscriptionsComponent,
    },
    {
        path:      'plans',
        component: PlansComponent,
    },
    {
        path:      'payment-information',
        component: PaymentComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(billingRoutes)],
    exports: [RouterModule],
})
export class BillingRoutingModule {
}
