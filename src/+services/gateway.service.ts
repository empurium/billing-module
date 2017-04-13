import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@freescan/http';
import { FREESCAN_ENV, Environment } from '@freescan/skeleton';

import { gatewayId } from '../configuration';
import { Gateway, GatewayResponse } from '../+models';


@Injectable()
export class GatewayService {
    public cashier: string = '';

    // Cache
    public gateway: Gateway;

    constructor(private http: HttpService,
                @Inject(FREESCAN_ENV) private environment: Environment) {
        this.cashier = environment.api.cashier;
    }

    /**
     * Request the Gateway information for the Stripe key.
     */
    public one(id: string = gatewayId): Observable<Gateway> {
        if (this.gateway && this.gateway.id) {
            return Observable.of(this.gateway);
        }

        return this.http
            .hostname(this.cashier)
            .get(`gateways/${id}`)
            .map((response: GatewayResponse) => {
                this.gateway = response.data;
                return response.data;
            });
    }
}
