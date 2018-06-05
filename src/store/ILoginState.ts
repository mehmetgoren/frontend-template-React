import { UserLocal } from "../models/entities";

export interface ILoginState{
    readonly userLocal? : UserLocal;
    readonly message?:string;
    readonly error?: any;
  }