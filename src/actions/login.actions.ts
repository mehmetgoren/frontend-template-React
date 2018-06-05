import { Action, Dispatch } from 'redux';
import { IStoreState } from '../store/IStoreState';
import { ILoginState } from '../store/ILoginState';
import { Credentials } from '../models/custom.models';
import { UnauthorizedService } from "../services/unauthorized.service";
import { UserLocal } from './../models/entities';
import { AppStorage } from '../utils/app-storage';
import { Toolbox } from '../utils/toolbox';
import { UtilsService } from '../services/utils.service';
import { metadataActions } from './metadata.actions';


//actions only describe the fact that something happened, but don't describe how the application's state changes.

export const loginActions = {
    login,
    logout
}

function login(credentials: Credentials, history, growl) {//action creator too but also dispatch other actions 
    return (dispatch: Dispatch<IStoreState>) => {

        dispatch(beginLogin(credentials, "Login operation has beeen started"));

        new UnauthorizedService().login(credentials)//aslında middleware' a gidecek.
            .then(userLocal => {
                if (userLocal && userLocal.Token) {
                    //userLocal.Role = undefined;
                    // userLocal.RoleId = undefined;
                    // userLocal.Person = undefined;
                    AppStorage.setUser(userLocal);
                    dispatch(metadataActions.pullMetadata());
                    dispatch(loginSuccess(credentials, "You have been successfully logged in.", userLocal));
                }
                else {
                    dispatch(loginFailed(credentials, "Invalid username or password."));
                    if (growl){
                        growl.show({ severity: 'warn', summary: "Login failed", detail: "Invalid username or password." });
                    }
                    if (history){
                        history.push('/');
                    }
                }
            }).catch(error => {
                dispatch(loginError(credentials, "Something went wrong.", error));
                if (growl){
                    growl.show({ severity: 'errror', summary: "An error occurred", detail: "Invalid username or password." });
                }
            });
    };
}

function logout(token: string, message: string) {
    return (dispatch: Dispatch<IStoreState>) => {
        new UnauthorizedService().logOut(token).then(result => {
            if (result) {
                const userLocal = AppStorage.getUser();
                AppStorage.logout();
                dispatch({
                    type: LoginActionType.LOGOUT_USER,
                    message,
                    userLocal
                });
            }
        });
    }
}


function beginLogin(credentials: Credentials, message: string): LoginAction {//action creator
    return {
        type: LoginActionType.LOGIN_USER_STARTED,
        message
    };
}

function loginSuccess(credentials: Credentials, message: string, userLocal: UserLocal): LoginAction {//action creator
    return {
        type: LoginActionType.LOGIN_USER_SUCCESS,
        message,
        userLocal
    };
}
function loginFailed(credentials: Credentials, message: string): LoginAction {
    return {
        type: LoginActionType.LOGIN_USER_FAILED,
        message
    };
}

function loginError(credentials: Credentials, message: string, error): LoginAction {//action creator
    return {
        type: LoginActionType.LOGIN_USER_ERROR,
        message,
        error
    };
}

export interface LoginAction extends Action, ILoginState {//action
}

export enum LoginActionType {
    LOGIN_USER_STARTED = "LOGIN_USER_STARTED",
    LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS",
    LOGIN_USER_FAILED = "LOGIN_USER_FAILED",
    LOGIN_USER_ERROR = "LOGIN_USER_ERROR",
    LOGOUT_USER = "LOGOUT_USER"
}