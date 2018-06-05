export interface Credentials {
    Username?: string;
    Password?: string;
}

//Neden İsmi ServerResponse Çünkü Angular' ın da Response Nesnesi var.
export interface ServerResponse<T> {
    Data: T[],
    Total: number,
    Error: any
    Message:string;
}