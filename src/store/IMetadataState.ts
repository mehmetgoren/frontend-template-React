import { Field } from '../models/entities';


export interface IMetadataState{
    metadata?:Metadata;
    failedReason?; 
}

export type Metadata = { [name: string]: Field[] };
