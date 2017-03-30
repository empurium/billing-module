import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpService } from '@freescan/http';
import { FREESCAN_ENV, Environment, AuthenticationService } from '@freescan/skeleton';

import { BillingRoutingModule } from './src/billing.routing';
import { BillingService } from './src/billing.service';
import { WizardComponent } from './src/wizard/wizard.component';
import { SubscriptionsComponent } from './src/subscriptions/subscriptions.component';
import { PlansComponent } from './src/plans/plans.component';
import { PaymentComponent } from './src/payment/payment.component';

export * from './src/billing.service';
export * from './src/billing.routing';

@NgModule({
    imports: [
        CommonModule,
        BillingRoutingModule,
    ],

    exports: [
        WizardComponent,
        PlansComponent,
        PaymentComponent,
    ],

    declarations: [
        WizardComponent,
        SubscriptionsComponent,
        PlansComponent,
        PaymentComponent,
    ],
})
export class BillingModule {
    public static forRoot(environment: Environment): ModuleWithProviders {
        return {
            ngModule:  BillingModule,
            providers: [
                { provide: FREESCAN_ENV, useValue: environment },
                OAuthService,
                HttpService,
                AuthenticationService,
                {
                    provide:  AuthenticationService,
                    useClass: AuthenticationService,
                    deps:     [OAuthService, FREESCAN_ENV],
                },
                {
                    provide:  BillingService,
                    useClass: BillingService,
                    deps:     [HttpService, FREESCAN_ENV],
                },
            ],
        };
    }
}
