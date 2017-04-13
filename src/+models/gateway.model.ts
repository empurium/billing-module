import { Response } from '@freescan/skeleton';

export class Gateway {
    public id: string;
    public key: string;
    public description: string;
    public type: string;
}

export class GatewayResponse extends Response {
    public data: Gateway;
}
