import * as React from 'react';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Toolbox } from '../../../utils/toolbox';
import { IStoreState } from '../../../store/IStoreState'
import { ComponentBase } from '../../component-base';
import { loginActions } from '../../../actions/login.actions';
import { layoutActions, LayoutAction } from '../../../actions/layout.actions';
import { MenuOrientation, ILayoutState } from '../../../store/ILayoutState';
import { InputText } from 'primereact/components/inputtext/InputText';


interface AppTopbarProps {
    layoutMode?: MenuOrientation;
    topbarMenuActive?: boolean;
    profileMode?: string;
    activeTopbarItem?: string;
    rotateMenuButton?:boolean;
    overlayMenuActive?:boolean;
    staticMenuDesktopInactive?:boolean;
    staticMenuMobileActive?:boolean;
    rightPanelActive?:boolean;

    onMenuButtonClick?: (rotateMenuButton: boolean, layoutMode: MenuOrientation, overlayMenuActive:boolean
        , staticMenuDesktopInactive: boolean, staticMenuMobileActive: boolean) => LayoutAction;
   
    onRightPanelButtonClick?: (rightPanelActive: boolean) => LayoutAction;

    onTopbarMenuButtonClick?: (topbarMenuActive: boolean) => LayoutAction;

    onTopbarItemClick?: (oldActiveTopbarItem: string,  newActiveTopbarItem: string) => LayoutAction;

    logout?: (token: string, message: string) => (dispatch: Dispatch<IStoreState>) => void;
}
function mapStateToProps(state: IStoreState): AppTopbarProps {
    let ret: AppTopbarProps = {};
    if (state.layoutReducer) {
        ret.layoutMode = state.layoutReducer.layoutMode;
        ret.topbarMenuActive = state.layoutReducer.topbarMenuActive;
        ret.profileMode = state.layoutReducer.profileMode;
        ret.activeTopbarItem = state.layoutReducer.activeTopbarItem;
        ret.rotateMenuButton = state.layoutReducer.rotateMenuButton;
        ret.overlayMenuActive = state.layoutReducer.overlayMenuActive;
        ret.staticMenuDesktopInactive = state.layoutReducer.staticMenuDesktopInactive;
        ret.staticMenuMobileActive = state.layoutReducer.staticMenuMobileActive;
        ret.rightPanelActive = state.layoutReducer.rightPanelActive;
    }

    return ret;
}

function mapDispatchToProps(dispatch: Dispatch<IStoreState>): AppTopbarProps {
    const actions: AppTopbarProps = {

        onMenuButtonClick: (rotateMenuButton: boolean, layoutMode: MenuOrientation, overlayMenuActive:boolean
            , staticMenuDesktopInactive: boolean, staticMenuMobileActive: boolean) => 
            dispatch(layoutActions.onMenuButtonClick(rotateMenuButton, layoutMode, overlayMenuActive, Toolbox.isDesktop(), staticMenuDesktopInactive, staticMenuMobileActive)),

        onRightPanelButtonClick:  //bindActionCreators(layoutActions.onRightPanelButtonClick, dispatch),
        (rightPanelActive:boolean) => dispatch(layoutActions.onRightPanelButtonClick(rightPanelActive)),

        onTopbarMenuButtonClick: (topbarMenuActive) => dispatch(layoutActions.onTopbarMenuButtonClick(topbarMenuActive)),

        onTopbarItemClick: (oldActiveTopbarItem: string,  newActiveTopbarItem: string) => dispatch(layoutActions.onTopbarItemClick(oldActiveTopbarItem, newActiveTopbarItem)),

        logout: bindActionCreators(loginActions.logout, dispatch)//dispatch döndürüyor.
    };
    //console.log("ownProps: " + JSON.stringify(ownProps));
    return actions;
}

interface AppTopbarState {

}

class AppTopbarComponent extends React.Component<AppTopbarProps, AppTopbarState> {
    constructor(props: AppTopbarProps) {
        super(props, false);

        this.state = {};
    }


    onMenuButtonClick = (e) => {
        e.preventDefault();
        const  {rotateMenuButton, layoutMode,overlayMenuActive, staticMenuDesktopInactive, staticMenuMobileActive} = this.props;    
        this.props.onMenuButtonClick(rotateMenuButton,layoutMode, overlayMenuActive, staticMenuDesktopInactive, staticMenuMobileActive);
    };

    onRightPanelButtonClick = (e) => {
        e.preventDefault();      
        const { rightPanelActive } = this.props;
        this.props.onRightPanelButtonClick(rightPanelActive);
    };

    onTopbarMenuButtonClick = (e) => {  
        const { topbarMenuActive } = this.props;
        this.props.onTopbarMenuButtonClick(topbarMenuActive);
        e.preventDefault();
    };

    onTopbarItemClick(e, newActiveTopbarItem: string) {
        const { activeTopbarItem } = this.props;
        this.props.onTopbarItemClick(activeTopbarItem, newActiveTopbarItem);
        e.preventDefault();
    };

    render() {
        const { layoutMode, topbarMenuActive, profileMode, activeTopbarItem } = this.props;
        return (
            <div className="topbar clearfix">
                <div className="topbar-left">
                    <div className="logo"></div>
                </div>

                <div className="topbar-right">
                    <a id="menu-button" href="#" onClick={this.onMenuButtonClick} >
                        <i></i>
                    </a>

                    <a id="rightpanel-menu-button" href="#" onClick={this.onRightPanelButtonClick}>
                        <i className="material-icons">more_vert</i>
                    </a>

                    <a id="topbar-menu-button" href="#" onClick={this.onTopbarMenuButtonClick}>
                        <i className="material-icons">menu</i>
                    </a>

                    <ul className={"topbar-items animated fadeInDown" + (topbarMenuActive ? " topbar-items-visible" : "")} >
                        {profileMode === "top" && layoutMode === MenuOrientation.HORIZONTAL ?
                            <li id="profile" className={"profile-item active-top-menu" + (activeTopbarItem === "profile" ? " active-top-menu" : "")}>

                                <a href="#" onClick={(e) => this.onTopbarItemClick(e, "profile")}>
                                    <img className="profile-image" src="assets/layout/images/avatar.png" />
                                    <span className="topbar-item-name">Jane Williams</span>
                                </a>


                                <ul className="ultima-menu animated fadeInDown">
                                    <li role="menuitem">
                                        <a href="#">
                                            <i className="material-icons">person</i>
                                            <span>Profile</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a href="#">
                                            <i className="material-icons">security</i>
                                            <span>Privacy</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a href="#">
                                            <i className="material-icons">settings_applications</i>
                                            <span>Settings</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a href="#">
                                            <i className="material-icons">power_settings_new</i>
                                            <span>Logout</span>
                                        </a>
                                    </li>
                                </ul>

                            </li>
                            : null
                        }

                        <li id="settings" className={activeTopbarItem === "settings" ? " active-top-menu" : ""}>
                            <a href="#" onClick={(e) => this.onTopbarItemClick(e, "settings")}>
                                <i className="topbar-icon material-icons">settings</i>
                                <span className="topbar-item-name">Settings</span>
                            </a>

                            <ul className="ultima-menu animated fadeInDown">
                                <li role="menuitem">
                                    <a href="#">
                                        <i className="material-icons">palette</i>
                                        <span>Change Theme</span>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#">
                                        <i className="material-icons">favorite_border</i>
                                        <span>Favorites</span>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#">
                                        <i className="material-icons">lock</i>
                                        <span>Lock Screen</span>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#">
                                        <i className="material-icons">wallpaper</i>
                                        <span>Wallpaper</span>
                                    </a>
                                </li>
                            </ul>

                        </li>

                        <li id="messages" className={activeTopbarItem === "messages" ? " active-top-menu" : ""}>
                            <a href="#" onClick={(e) => this.onTopbarItemClick(e, "messages")}>
                                <i className="topbar-icon material-icons animated swing">message</i>
                                <span className="topbar-badge animated rubberBand">5</span>
                                <span className="topbar-item-name">Messages</span>
                            </a>

                            <ul className="ultima-menu animated fadeInDown">
                                <li role="menuitem">
                                    <a href="#" className="topbar-message">
                                        <img src="assets/layout/images/avatar1.png" width="35" />
                                        <span>Give me a call</span>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#" className="topbar-message">
                                        <img src="assets/layout/images/avatar2.png" width="35" />
                                        <span>Sales reports attached</span>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#" className="topbar-message">
                                        <img src="assets/layout/images/avatar3.png" width="35" />
                                        <span>About your invoice</span>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#" className="topbar-message">
                                        <img src="assets/layout/images/avatar2.png" width="35" />
                                        <span>Meeting today at 10pm</span>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#" className="topbar-message">
                                        <img src="assets/layout/images/avatar4.png" width="35" />
                                        <span>Out of office</span>
                                    </a>
                                </li>
                            </ul>

                        </li>

                        <li id="notifications" className={activeTopbarItem === "notifications" ? " active-top-menu" : ""}>
                            <a href="#" onClick={(e) => this.onTopbarItemClick(e, "notifications")}>
                                <i className="topbar-icon material-icons">timer</i>
                                <span className="topbar-badge animated rubberBand">4</span>
                                <span className="topbar-item-name">Notifications</span>
                            </a>

                            <ul className="ultima-menu animated fadeInDown">
                                <li role="menuitem">
                                    <a href="#">
                                        <i className="material-icons">bug_report</i>
                                        <span>Pending tasks</span>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#">
                                        <i className="material-icons">event</i>
                                        <span>Meeting today at 3pm</span>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#">
                                        <i className="material-icons">file_download</i>
                                        <span>Download documents</span>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#">
                                        <i className="material-icons">flight</i>
                                        <span>Book flight</span>
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li id="search" className={ "search-item" + (activeTopbarItem === "search" ? " active-top-menu" : "")}
                            onClick={(e) => this.onTopbarItemClick(e, "search")}>
                            <span className="md-inputfield">
                                <InputText type="text" />
                                <label>Search</label>
                                <i className="topbar-icon material-icons">search</i>
                            </span>
                        </li>

                    </ul>

                </div>
            </div>
        );
    }
}


const connectedAppTopbarComponent: any = connect(mapStateToProps, mapDispatchToProps)(AppTopbarComponent);
export { connectedAppTopbarComponent as AppTopbarComponent }; 
