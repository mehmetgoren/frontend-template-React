import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { IStoreState } from '../../../store/IStoreState'
import { MenuItem } from './app-submenu.component';
import { AppStorage } from './../../../utils/app-storage';


interface AppBreadcrumbProps {

}
function mapStateToProps(state: IStoreState): AppBreadcrumbProps {
    let ret: AppBreadcrumbProps = {};
    return ret;
}
function mapDispatchToProps(dispatch: Dispatch<IStoreState>): AppBreadcrumbProps {
    const actions: AppBreadcrumbProps = {
    };
    return actions;
}


interface AppBreadcrumbState {
    items?: MenuItem[];
}

class AppBreadcrumbComponent extends React.Component<AppBreadcrumbProps, AppBreadcrumbState> {
    constructor(props: AppBreadcrumbProps) {
        super(props);

        this.state = {};

        //this.onRightPanelButtonClick = this.onRightPanelButtonClick.bind(this);
    }

    onLogOut = (e) => {
        AppStorage.logout();
    }



    render() {
        return (
            <div className="layout-breadcrumb">
                <ul>
                    <li>
                        <a >
                            <i className="material-icons">home</i>
                        </a>
                    </li>

                    {
                        this.state.items &&
                        this.state.items.map(i => {

                        })
                    }

                    <li>/</li>
                </ul>

                <div className="layout-breadcrumb-options">
                    <a title="Backup">
                        <i className="material-icons">backup</i>
                    </a>
                    <a title="Bookmark">
                        <i className="material-icons">bookmark</i>
                    </a>
                    <a title="Logout" onClick={this.onLogOut}>
                        <i className="material-icons">power_settings_new</i>
                    </a>
                </div>

            </div>
        );
    }
}

const connectedAppBreadcrumbComponent: any = connect(mapStateToProps, mapDispatchToProps)(AppBreadcrumbComponent);
export { connectedAppBreadcrumbComponent as AppBreadcrumbComponent }; 
