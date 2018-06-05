import { Dispatch, Action } from 'redux';
import { IStoreState } from '../store/IStoreState';
import { Field } from '../models/entities';
import { IMetadataState, Metadata } from '../store/IMetadataState';
import { UtilsService } from '../services/utils.service';
import { AppStorage } from '../utils/app-storage';

export const metadataActions = {
    pullMetadata
};


function pullMetadata() {//action creator too but also dispatch other actions 
    return (dispatch: Dispatch<IStoreState>) => {

        let typefullNameList: string[] = [];
        for (let item in Types) {
            typefullNameList.push(Types[item]);
        }

        new UtilsService().getMetaData(typefullNameList).then(data => {
            //console.log(JSON.stringify(data));
            dispatch(metadataPulled(data));
        }).catch(reason => {
            dispatch(metadataPulledFailed(reason));
            AppStorage.logout();
        });

    };
}

function metadataPulled(metaData: Metadata): MetadataAction {
    return {
        type: MetadataActionType.METADATA_PULLED,
        metadata: metaData
    };
}

function metadataPulledFailed(reason): MetadataAction {
    return {
        type: MetadataActionType.METADATA_PULLED,
        failedReason: reason
    };
}



export interface MetadataAction extends Action, IMetadataState {//action
}

export enum MetadataActionType {
    METADATA_PULLED = "METADATA_PULLED",
    METADATA_PULLED_FAILED = "METADATA_PULLED_FAILED"
}


export const Types = {
    Role: "Server.Models.Role",
    Menu: "Server.Models.Menu",
    AppUser: "Server.Models.AppUser",
    V_AppUser: "Server.Models.V_AppUser"
}

