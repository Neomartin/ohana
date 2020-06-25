export class Order {
    constructor(
    public client_id: string,
    public items: Array<any>,
    public status: string,
    public created_at: number,
    public end_at: number,
    public price: number,
    public branch_id: string,
    public partial_payment?: number,
    public modified_at?: number,
    public shipping?: Boolean,
    public shipping_price?: number
    ) {}
}
