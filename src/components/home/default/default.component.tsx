import './default.component.css';

import * as React from 'react';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from "react-router-dom";
import { Router, Route, Redirect, Switch, BrowserRouter } from 'react-router-dom';

import { ScrollPanel } from 'primereact/components/scrollpanel/ScrollPanel';


import { ComponentBase } from '../../component-base';
import { Toolbox } from '../../../utils/toolbox';
import { IStoreState } from '../../../store/IStoreState'
import { AppStorage, history } from '../../../utils/app-storage';
import { MenuOrientation } from '../../../store/ILayoutState';
import { AppTopbarComponent } from './app-topbar.component';
import { AppFooterComponent } from './app-footer.component';
import { AppInlineProfileComponent } from './app-inline-profile.component';
import { layoutActions, LayoutAction } from '../../../actions/layout.actions';
import { AppMenuComponent } from './app-menu.component';
import { AppBreadcrumbComponent } from './app-breadcrumb.component';
import { AppRightpanelComponent } from './app.rightpanel.component';
import { MenuComponent } from '../../admin-panel/menu/menu.component';
import { LoginComponent } from '../login/login.component';
import { AppUserComponent } from '../../admin-panel/app-user/app-user.component';
import { AppSettingsComponent } from '../../admin-panel/app-settings/app-settings.component';
import { ImageDemoComponent } from '../../admin-panel/image-demo/image-demo.component';
import { QueryLogComponent } from '../../admin-panel/query-log/query-log.component';
import { RoleActionsComponent } from '../../admin-panel/role-actions/role-actions.component';
import { RoleMenusComponent } from '../../admin-panel/role-menus/role-menus.component';
import { RolesComponent } from '../../admin-panel/roles/roles.component';
import { ServerDashboardComponent } from '../../admin-panel/server-dashboard/server-dashboard.component';


interface DefaultProps {
    layoutCompact?: boolean;
    layoutMode?: MenuOrientation;

    topbarMenuActive?: boolean;
    menuHoverActive?: boolean;
    resetMenu?: boolean;
    overlayMenuActive?: boolean;
    staticMenuMobileActive?: boolean;
    topbarItemClick?: boolean;
    menuClick?: boolean;
    rightPanelClick?: boolean;
    staticMenuDesktopInactive?: boolean;
    profileMode?: string;

    onMenuClick?: () => LayoutAction;
    onLayoutClick?: (topbarItemClick: boolean, menuClick: boolean, layoutMode: MenuOrientation
        , overlayMenuActive: boolean, staticMenuMobileActive: boolean, rightPanelClick: boolean) => LayoutAction;
    onRightPanelClick?: () => LayoutAction;
}
function mapStateToProps(state: IStoreState): DefaultProps {
    let ret: DefaultProps = {};

    ret.layoutCompact = state.layoutReducer.layoutCompact;
    ret.layoutMode = state.layoutReducer.layoutMode;

    ret.topbarMenuActive = state.layoutReducer.topbarMenuActive;
    ret.menuHoverActive = state.layoutReducer.menuHoverActive;
    ret.resetMenu = state.layoutReducer.resetMenu;
    ret.overlayMenuActive = state.layoutReducer.overlayMenuActive;
    ret.staticMenuMobileActive = state.layoutReducer.staticMenuMobileActive;
    ret.topbarItemClick = state.layoutReducer.topbarItemClick;
    ret.menuClick = state.layoutReducer.menuClick;
    ret.rightPanelClick = state.layoutReducer.rightPanelClick;
    ret.staticMenuDesktopInactive = state.layoutReducer.staticMenuDesktopInactive;
    ret.profileMode = state.layoutReducer.profileMode;

    return ret;
}

function mapDispatchToProps(dispatch: Dispatch<IStoreState>): DefaultProps {
    const actions = {
        onMenuClick: () => dispatch(layoutActions.onMenuClick),

        onLayoutClick: (topbarItemClick: boolean, menuClick: boolean, layoutMode: MenuOrientation
            , overlayMenuActive: boolean, staticMenuMobileActive: boolean, rightPanelClick: boolean) =>
            dispatch(() => layoutActions.onLayoutClick(topbarItemClick, menuClick, layoutMode, overlayMenuActive, staticMenuMobileActive, rightPanelClick)),

        onRightPanelClick: () => dispatch(layoutActions.onRightPanelClick)
    };
    return actions;
}

interface DefaultState {
    darkMenu?: boolean;
}

class DefaultComponent extends React.Component<DefaultProps, DefaultState> {
    constructor(props: DefaultProps) {
        super(props, false);

        this.state = { darkMenu: false };
    }

    componentWillMount() {
    }


    onMenuClick = (e) => {
        this.props.onMenuClick();
    }

    onLayoutClick = (e) => {
        const { topbarItemClick, menuClick, layoutMode, overlayMenuActive, staticMenuMobileActive, rightPanelClick } = this.props;
        this.props.onLayoutClick(topbarItemClick, menuClick, layoutMode, overlayMenuActive, staticMenuMobileActive, rightPanelClick);
    }

    onRightPanelClick = (e) => {
        this.props.onRightPanelClick();
    }

    render() {
        const { layoutCompact, layoutMode, overlayMenuActive, staticMenuMobileActive, staticMenuDesktopInactive, profileMode } = this.props;
        return (
            <div className={"layout-wrapper" + (layoutCompact ? " layout-compact" : "")} onClick={this.onLayoutClick}>
                <div className={"layout-container"
                    + (layoutMode !== MenuOrientation.OVERLAY ? " menu-layout-static" : "")
                    + (layoutMode === MenuOrientation.OVERLAY ? " menu-layout-overlay" : "")
                    + (overlayMenuActive ? " layout-menu-overlay-active" : "")
                    + (layoutMode === MenuOrientation.HORIZONTAL ? " menu-layout-horizontal" : "")
                    + (layoutMode === MenuOrientation.SLIM ? " menu-layout-slim" : "")
                    + (staticMenuDesktopInactive ? " layout-menu-static-inactive" : "")
                    + (staticMenuMobileActive ? " layout-menu-static-active" : "")
                }>

                    <AppTopbarComponent />

                    <div className={"layout-menu" + (this.state.darkMenu ? " layout-menu-dark" : "")} onClick={this.onMenuClick}>
                        <ScrollPanel style={{ height: "100%" }}>
                            {(profileMode === "inline" && layoutMode !== MenuOrientation.HORIZONTAL) && <AppInlineProfileComponent />}
                            <AppMenuComponent />
                        </ScrollPanel>
                    </div>

                    <div className={"layout-main" + (this.state.darkMenu ? " layout-menu-dark" : "")}>
                        {false && <AppBreadcrumbComponent />}

                        <div className="layout-content">


                            <Router history={history}>
                                <React.Fragment>
                                    <Route path="/Menus" component={MenuComponent} />
                                    <Route path="/AppUsers" component={AppUserComponent} />  
                                    <Route path="/AppSettings" component={AppSettingsComponent} />                      
                                    <Route path="/ImageDemo" component={ImageDemoComponent} />                
                                    <Route path="/QueryLog" component={QueryLogComponent} />        
                                    <Route path="/RoleActions" component={RoleActionsComponent} />                         
                                    <Route path="/RoleMenus" component={RoleMenusComponent} />             
                                    <Route path="/Roles" component={RolesComponent} />  
                                    <Route path="/ServerDashboard" component={ServerDashboardComponent} />
                                </React.Fragment>
                            </Router>

                            <AppFooterComponent />
                        </div>

                    </div>

                    <AppRightpanelComponent />


                    <div className="layout-mask"></div>
                </div>
            </div>
        );
    }
}


const connectedDefaultComponent = connect(mapStateToProps, mapDispatchToProps)(DefaultComponent);
export { connectedDefaultComponent as DefaultComponent }; 
