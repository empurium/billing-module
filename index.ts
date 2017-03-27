import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '@freescan/http';

import { BillingRoutingModule } from './src/billing.routing';
import { BillingService } from './src/billing.service';
import { WizardComponent } from './src/wizard/wizard.component';
import { PlansComponent } from './src/plans/plans.component';
import { PaymentComponent } from './src/payment/payment.component';

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
        PlansComponent,
        PaymentComponent,
    ],
})
export class BillingModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule:  BillingModule,
            providers: [
                HttpService,
                BillingService,
            ],
        };
    }
}
