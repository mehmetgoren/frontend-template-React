import './app-inline-profile.component.css';
import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { IStoreState } from '../../../store/IStoreState'
import { AppStorage } from '../../../utils/app-storage';


interface AppInlineProfileProps {
}
function mapStateToProps(state: IStoreState): AppInlineProfileProps {
    let ret: AppInlineProfileProps = {};
    return ret;
}

function mapDispatchToProps(dispatch: Dispatch<IStoreState>): AppInlineProfileProps {
    const actions: AppInlineProfileProps = {
    };
    return actions;
}

interface AppInlineProfileState {
    active?: boolean;
}

class AppInlineProfileComponent extends React.Component<AppInlineProfileProps, AppInlineProfileState> {
    constructor(props: AppInlineProfileProps) {
        super(props, false);

        this.state = { active:false };
    }

    onClick = (e) => {
        this.setState( (prevState) => ({
            active: !prevState.active
        }) );
        // setTimeout(() => {
        //     this.app.layoutMenuScrollerViewChild.moveBar();
        //   }, 450);
        e.preventDefault();
    };

    onLogout = (e)=>{
        AppStorage.logout();
    };


    render() {
        return (<div>
            <div className={"profile" + (this.state.active ? " profile-expanded" : "")}>
                <a href="#" onClick={this.onClick} >
                    <img className="profile-image" src="assets/layout/images/avatar.png" />
                    <span className="profile-name">Jane Williams</span>
                    <i className="material-icons">keyboard_arrow_down</i>
                </a>
            </div>
            <ul className={"ultima-menu profile-menu" + (this.state.active ? " ulVisible" : " ulHidden")}>
                <li role="menuitem">
                    <a href="#" className="ripplelink" tabIndex={!this.state.active ? -1 : null}>
                        <i className="material-icons">person</i>
                        <span>Profile</span>
                    </a>
                </li>
                <li role="menuitem">
                    <a href="#" className="ripplelink" tabIndex={!this.state.active ? -1 : null}>
                        <i className="material-icons">security</i>
                        <span>Privacy</span>
                    </a>
                </li>
                <li role="menuitem">
                    <a href="#" className="ripplelink" tabIndex={!this.state.active ? -1 : null}>
                        <i className="material-icons">settings_application</i>
                        <span>Settings</span>
                    </a>
                </li>
                <li role="menuitem">
                    <a href="#" className="ripplelink" tabIndex={!this.state.active ? -1 : null} onClick={this.onLogout}>
                        <i className="material-icons">power_settings_new</i>
                        <span>Logout</span>
                    </a>
                </li>
            </ul>
            </div>
        );
    }
}

const connectedAppInlineProfileComponent: any = connect(mapStateToProps, mapDispatchToProps)(AppInlineProfileComponent);
export { connectedAppInlineProfileComponent as AppInlineProfileComponent }; 
