import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { IStoreState } from '../../../store/IStoreState'
import { Menu } from '../../../models/entities';
import { MenuItem, AppSubMenuComponent } from './app-submenu.component';
import { AdminPanelService } from '../../../services/admin-panel.service';
import { AppStorage } from '../../../utils/app-storage';
import { V_Menu } from './../../../models/entities';
import { Toolbox } from '../../../utils/toolbox';
 

interface AppMenuProps {

}
function mapStateToProps(state: IStoreState): AppMenuProps {
    let ret: AppMenuProps = {};
    return ret;
}
function mapDispatchToProps(dispatch: Dispatch<IStoreState>): AppMenuProps {
    const actions: AppMenuProps = {
    };
    return actions;
}


interface AppMenuState {
    model?: MenuItem[];
}

class AppMenuComponent extends React.Component<AppMenuProps, AppMenuState> {
    constructor(props: AppMenuProps) {
        super(props);

        this.state = {model:[]};
    }

    componentWillMount() {
        let user = AppStorage.getUser();
        if (!user)
            return;
        let model: MenuItem[] = [];
        const service = new AdminPanelService();
        service.createMenu(user.RoleId).then(data => {
            if (data && data.length) {
                data.forEach(menuItem => {
                    let item: any = { label: menuItem.Name, icon: menuItem.Image };
                    if (menuItem.Childs && menuItem.Childs.length > 0) {
                        item.items = [];
                        menuItem.Childs.forEach(child => {
                            item.items.push({
                                label: child.Name, icon: child.Image, route: child.Route
                            });
                        });
                    }

                    model.push(item);
                });

                this.setState({ model: model });
            }
        });
    }



    render() {
        return (
            <ul className="ultima-menu ultima-main-menu clearfix">
                 <AppSubMenuComponent items={this.state.model} root={true} visible={true} />
            </ul>
        );
    }
}

const connectedAppMenuComponent: any = connect(mapStateToProps, mapDispatchToProps)(AppMenuComponent);
export { connectedAppMenuComponent as AppMenuComponent }; 
