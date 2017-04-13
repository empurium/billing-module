export class Meta {
    public pagination: {
        total: number;
        count: number;
        per_page: number;
        current_page: number;
        total_pages: number;
        links: Array<string>;
    };
}

export class Response {
    public status: string;
    public message: string;
    public meta: Meta;

    // Consumers must implement their own 'data' key accordingly
}
