import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpService } from '@rndstudio/http';
import { FREESCAN_ENV, AuthenticationService, SubscriptionService, WindowService } from '@rndstudio/skeleton';

import { ModalService } from './src/+services/modal.service';
import { GatewayService } from './src/+services/gateway.service';
import { PlanService } from './src/+services/plan.service';
import { StripeService } from './src/+services/stripe.service';

import { ModalComponent } from './src/modal/modal.component';
import { LoadingComponent } from './src/loading/loading.component';
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
export * from './src/+services/stripe.service';


const providers: Provider[] = [
    WindowService,
    AuthenticationService,
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
        LoadingComponent,
        BillingButtonComponent,
        PayWallComponent,
        SubscriptionsComponent,
        IntroComponent,
        PlansComponent,
        PaymentComponent,
    ],

    declarations: [
        ModalComponent,
        LoadingComponent,
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
