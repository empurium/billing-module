export interface StripeResponse {
    complete: boolean;
    token: { id: string; };
    error: { message: string; };
}
