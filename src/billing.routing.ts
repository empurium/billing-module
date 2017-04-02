import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalComponent } from './modal/modal.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { PlansComponent } from './plans/plans.component';
import { PaymentComponent } from './payment/payment.component';

export const billingRoutes: Routes = [
    {
        path: 'billing',
        component: ModalComponent,
        children: [
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
        ],
    },
];


@NgModule({
    imports: [RouterModule.forChild(billingRoutes)],
    exports: [RouterModule],
})
export class BillingRoutingModule {
}
