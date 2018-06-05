import { createStore, compose, applyMiddleware } from "redux";
import thunk from 'redux-thunk';


import {IStoreState} from './IStoreState';
import rootReducers from './../reducers/rootReducers';



export const store = createStore<IStoreState>(
    rootReducers,
    applyMiddleware(thunk)
);