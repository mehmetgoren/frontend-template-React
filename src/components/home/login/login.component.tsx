import './login.component.css';

import * as React from 'react';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { loginActions } from '../../../actions/login.actions';
import { IStoreState } from '../../../store/IStoreState';
import { Credentials } from '../../../models/custom.models';

import { Growl, GrowlProps, GrowlMessage } from 'primereact/components/growl/Growl';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Toolbox } from '../../../utils/toolbox';
import { AppStorage, history } from '../../../utils/app-storage';
import { metadataActions } from './../../../actions/metadata.actions';


interface LoginProps {
    isAuthenticated?: boolean;
    msg?: string;
    login?: (credentials: Credentials, history, growl) => (dispatch: Dispatch<IStoreState>) => void;
    pullMetadata?:() =>(dispatch: Dispatch<IStoreState>) => void;
    // logout: () => Action;
}//üst component lerden gelen data lar.
function mapStateToProps(state: IStoreState): LoginProps {//bu işlem store'a subscripe olmaktır.
    let ret: LoginProps = {};

    if (state && state.loginReducer) {
        ret.msg = state.loginReducer.message;
        ret.isAuthenticated = !Toolbox.isUndefinedOrNull(state.loginReducer.userLocal);
    }
    //console.log("mapStateToProps: " + JSON.stringify(state.loginReducer));
    return ret;
}

function mapDispatchToProps(dispatch: Dispatch<IStoreState>): LoginProps {//to be called after every dispatch
    const actions: LoginProps = {
        login: bindActionCreators(loginActions.login, dispatch),
        // logout: bindActionCreators(userActions.logout, dispatch),
        pullMetadata:bindActionCreators(metadataActions.pullMetadata, dispatch)
    };
    //alert("mapDispatchToProps")
    return actions;
}


interface LoginState extends Credentials {

    // isAuthenticate?:boolean;
}

class LoginComponent extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);

        //this.props.logout();

        this.state = { Username: "", Password: "" };
        this.onLogin = this.onLogin.bind(this);
    }

    componentDidMount() {
        AppStorage.removeUser();//varsayılana çekiyoruz ve sessionstore u boşaltıyoruz.

        const me = this;
        setTimeout(() => {
            this.setState({Username:"admin", Password:"admin"});
            me.onLogin(null);
        }, 1000);
    }

    onLogin(e) {
        if (e)e.preventDefault();
        const currentState = Toolbox.copyShallow(this.state);
        if (currentState.Username && currentState.Password) {
            this.props.login(currentState, history, this.growl);
            //dispatch(userActions.login(currentState));
        }
        else if (this.growl)
            this.growl.show({ severity: 'error', detail: "Please enter username and password" });
    }

    growl;
    render() {
        return (
            <div>
                <Growl ref={(el) => { this.growl = el; }}></Growl>
                <div className="login-body loginContainer">
                    <form method="post">
                        <div className="card login-panel ui-fluid">
                            <div className="ui-g">
                                <div className="ui-g-12">
                                    <h1 className="loginCaption">Welcome </h1>
                                </div>
                                <div className="ui-g-12">
                                    <span className="md-inputfield">
                                        <InputText type="text" autoComplete="off" onChange={(e: any) => this.setState({ Username: e.target.value })} />
                                        <label>Username</label>
                                    </span>
                                </div>
                                <div className="ui-g-12">
                                    <span className="md-inputfield">
                                        <InputText type="password" autoComplete="off" onChange={(e: any) => this.setState({ Password: e.target.value })} />
                                        <label>Password</label>
                                    </span>
                                </div>
                                <div className="ui-g-12">
                                    <button type="button" className="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-left"
                                        onClick={this.onLogin}>
                                        <span className="ui-button-icon-left ui-c fa fa-fw ui-icon-person"></span>
                                        <span className="ui-button-text ui-c">Login</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}


const connectedLoginComponent = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
export { connectedLoginComponent as LoginComponent }; 
