export interface item {
    id?: string //Might already be there
    barcode: string,
    dueDate: Date | null,
    name: string,
    user_id: string
}