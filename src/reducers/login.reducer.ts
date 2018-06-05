import { LoginAction, LoginActionType } from "../actions/login.actions";
import { Toolbox } from "../utils/toolbox";
import { ILoginState } from '../store/ILoginState';
import { AppStorage } from "../utils/app-storage";

export function loginReducer(state = defaultState, action:LoginAction) : ILoginState{
    switch(action.type){
        case LoginActionType.LOGIN_USER_ERROR :
            return { ...state, userLocal:null, message:action.message, error:action.error }; 
        case LoginActionType.LOGIN_USER_SUCCESS:
            return { ...state,  userLocal : action.userLocal, message:action.message }; //Toolbox.copyShallow(state, {user: { userLocal : action.userLocal,  } });
        case LoginActionType.LOGIN_USER_STARTED:
        case LoginActionType.LOGIN_USER_FAILED:
        case LoginActionType.LOGOUT_USER:
            return { ...state,  userLocal : null, message:action.message };  //Toolbox.copyShallow(state, {user: { userLocal : null } });
        default:
            return state;
    }
}

const defaultState: ILoginState = {
     userLocal:AppStorage.getUser(),
     message:"",
     error : undefined 
  };