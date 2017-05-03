import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpService } from '@freescan/http';
import { FREESCAN_ENV, AuthenticationService } from '@freescan/skeleton';

import { ModalService } from './src/+services/modal.service';
import { GatewayService } from './src/+services/gateway.service';
import { PlanService } from './src/+services/plan.service';
import { SubscriptionService } from './src/+services/subscription.service';
import { StripeService } from './src/+services/stripe.service';

import { ModalComponent } from './src/modal/modal.component';
import { BillingButtonComponent } from './src/billing-button/billing-button.component';
import { PayWallComponent } from './src/paywall/paywall.component';
import { SubscriptionsComponent } from './src/subscriptions/subscriptions.component';
import { IntroComponent } from './src/intro/intro.component';
import { PlansComponent } from './src/plans/plans.component';
import { PaymentComponent } from './src/payment/payment.component';

export * from './src';
export * from './src/+services/modal.service';
export * from './src/+services/gateway.service';
export * from './src/+services/plan.service';
export * from './src/+services/subscription.service';
export * from './src/+services/stripe.service';


const providers: Provider[] = [
    ModalService,
    {
        provide:  GatewayService,
        useClass: GatewayService,
        deps:     [HttpService, FREESCAN_ENV],
    },
    {
        provide:  PlanService,
        useClass: PlanService,
        deps:     [HttpService, FREESCAN_ENV],
    },
    {
        provide:  SubscriptionService,
        useClass: SubscriptionService,
        deps:     [HttpService, AuthenticationService, FREESCAN_ENV],
    },
    {
        provide:  StripeService,
        useClass: StripeService,
        deps:     [GatewayService, SubscriptionService, PlanService, FREESCAN_ENV],
    },
];


@NgModule({
    imports: [
        CommonModule,
        ModalModule.forRoot(),
    ],

    exports: [
        ModalModule,
        ModalComponent,
        BillingButtonComponent,
        PayWallComponent,
        SubscriptionsComponent,
        IntroComponent,
        PlansComponent,
        PaymentComponent,
    ],

    declarations: [
        ModalComponent,
        BillingButtonComponent,
        PayWallComponent,
        SubscriptionsComponent,
        IntroComponent,
        PlansComponent,
        PaymentComponent,
    ],
})
export class BillingModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule:  BillingModule,
            providers: [
                ...providers,
            ],
        };
    }
}
