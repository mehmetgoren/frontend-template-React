import { BaseService } from './base.service';
import { UserLocal } from '../models/entities';
import { Credentials } from '../models/custom.models';


export class UnauthorizedService extends BaseService {

    constructor() {
        super(false);
    }

    login(credentials: Credentials): Promise<UserLocal> {
        return this.postSingle<UserLocal>("/api/Unauthorized/Login", credentials, true);
    }

    logOut(token: string): Promise<boolean> {
        return this.getSingle<boolean>("/api/Unauthorized?token=" + token, false);
    }
}