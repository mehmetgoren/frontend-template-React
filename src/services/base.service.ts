import { ServerResponse } from '../models/custom.models';
import { AppStorage } from '../utils/app-storage';

declare var $;

export abstract class BaseService {

    private _auth: Boolean;
    protected get auth(): Boolean {
        return this._auth;
    }
    protected set auth(value: Boolean) {
        this._auth = value;
    }

    private _showLog;
    protected get showLog(): boolean {
        return this._showLog;
    }
    protected set showLog(value: boolean) {
        this._showLog = value;
    }

    constructor(auth = true, showLog = true) {
        this._auth = auth;
        this._showLog = showLog;
    }

    protected log(msg, logType) {
        if (this.showLog) {
            switch (logType) {
                case LogType.info:
                    console.log(msg);
                case LogType.warn:
                    console.warn(msg);
                case LogType.error:
                    console.error(msg);
            }
        }
    }
    protected showError(msg) {//toolbox da circular reference oılduğundan buyraya alındı
        alertify.alert((typeof msg === 'string') ? msg : JSON.stringify(msg));
        //alert("Error:\n" +  isString(msg) ? msg : JSON.stringify(msg));
    }

    protected createHeader(isPost: boolean): HeadersInit {
        let header: { [key: string]: string } = {};
        if (isPost) {
            header["Accept"] = "application/json, text/plain, */*";
            header["Content-Type"] = "application/json";
        }

        if (this.auth) {
            const token = AppStorage.getToken();
            if (!token) {
                const errorMsg = "Auth token not found";
                this.log(errorMsg, LogType.error);
                throw new Error(errorMsg);
            }
            header["Authorization"] = "Token " + btoa(token);
        }

        return header;
    }


    private _call<T>(req: RequestInit, url: string, onSuccess: (data: ServerResponse<T>) => void, onError: (error: any) => void, blockUI: boolean): void {
        if (!req) {
            const reason = "request can not be null or undefined"
            onError(reason);
            this.log(reason, LogType.error);
            this.showError(reason);
            return;
        }
        if (!url) {
            const reason = "url can not be null or undefined"
            onError(reason);
            this.log(reason, LogType.error);
            this.showError(reason);
            return;
        }

        if (blockUI)
            $.blockUI();
        fetch(AppStorage.serverAddress + url, req).then(res => {
            if (blockUI)
                $.unblockUI();
            if (res.ok) {
                res.json().then(result => {
                    if (result) {
                        if (result.Error == null) {
                            onSuccess(result);
                        } else {
                            const reason = (JSON.stringify(result.Error) + "\n" + result.Message);
                            onError(reason);
                            this.log(reason, LogType.error);
                            this.showError(reason);
                        }
                    } else {
                        const reason = "'" + url + "' returns no valid response";
                        onError(reason);
                        this.log(reason, LogType.error);
                        this.showError(reason);
                    }
                })
            } else {
                if (blockUI)
                    $.unblockUI();
                onError(res.statusText);
                this.log(res.statusText, LogType.error);
                this.showError(res.statusText);
            }
        }).catch(error => {
            if (blockUI)
                $.unblockUI();
            const reason = (error && error.message) ? error.message : JSON.stringify(error);
            onError(reason);
            this.log(reason, LogType.error);
            this.showError(reason);
            AppStorage.logout();
        });
    }

    private call<T>(req: RequestInit, url: string, onSuccess: (data: T[]) => void, onError: (error: any) => void, blockUI: boolean): void {
        this._call<T>(req, url, (result) => {
            onSuccess(result ? result.Data : null);
        }, (error) => {
            (error);
        }, blockUI);
    }

    protected getSingle<T>(url: string, blockUI: boolean): Promise<T> {
        const req: RequestInit = {};//auth için
        req.headers = this.createHeader(false);

        return new Promise<T>((resolve, reject) => {
            this.call(req, url, (data: T[]) => {
                resolve(data && data.length ? data[0] : null);
            }, (error) => {
                reject(error);
            }, blockUI);
        });
    }

    protected getList<T>(url: string, blockUI: boolean): Promise<T[]> {
        const req: RequestInit = {};//auth için
        req.headers = this.createHeader(false);

        return new Promise<T[]>((resolve, reject) => {
            this.call(req, url, (data: T[]) => {
                resolve(data);
            }, (error) => {
                reject(error);
            }, blockUI);
        });
    }

    protected postSingle<T>(url: string, data, blockUI: boolean): Promise<T> {
        const req: RequestInit = {};//auth için
        req.method = "POST";
        req.headers = this.createHeader(true);
        if (data) {
            req.body = JSON.stringify(data);
        }

        return new Promise<T>((resolve, reject) => {
            this.call(req, url, (data: T[]) => {
                resolve(data && data.length ? data[0] : null);
            }, (error) => {
                reject(error);
            }, blockUI);
        });
    }

    protected postList<T>(url: string, data, blockUI: boolean): Promise<T[]> {
        const req: RequestInit = {};//auth için
        req.method = "POST";
        req.headers = this.createHeader(true);
        if (data) {
            req.body = JSON.stringify(data);
        }

        return new Promise<T[]>((resolve, reject) => {
            this.call(req, url, (data: T[]) => {
                resolve(data);
            }, (error) => {
                reject(error);
            }, blockUI);
        });
    }


    //Search İçin Eklendi.
    protected postListServerResponse(url: string, data: any, blockUi?: boolean): Promise<ServerResponse<any>> {
        const req: RequestInit = {};//auth için
        req.method = "POST";
        req.headers = this.createHeader(true);
        if (data) {
            req.body = JSON.stringify(data);
        }

        return new Promise<ServerResponse<any>>((resolve, reject) => {
            this._call(req, url, (data: ServerResponse<any>) => {
                resolve(data);
            }, (error) => {
                reject(error);
            }, blockUi);
        });
    }
}

enum LogType {
    info,
    warn,
    error
}