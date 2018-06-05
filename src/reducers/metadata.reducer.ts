import { IMetadataState } from '../store/IMetadataState';
import { MetadataAction, MetadataActionType } from '../actions/metadata.actions';


export function metadataReducer(state = defaultState, action: MetadataAction): IMetadataState {
    switch (action.type) {
        case MetadataActionType.METADATA_PULLED:
            return { ...state, metadata: action.metadata };
        case MetadataActionType.METADATA_PULLED_FAILED:
            return { ...state, failedReason: action.failedReason }
        default:
            return state;
    }
}

const defaultState: IMetadataState = {
    metadata: null,
    failedReason: null
};