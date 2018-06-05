import { combineReducers } from "redux";
import {IStoreState} from "../store/IStoreState";
import { loginReducer } from "./login.reducer";
import { layoutReducer } from './layout.reducer';
import { metadataReducer } from './metadata.reducer';

const rootReducers = combineReducers<IStoreState>({
    loginReducer,
    layoutReducer,
    metadataReducer
});

export default rootReducers;
