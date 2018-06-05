import './app-submenu.component.css';

import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { IStoreState } from '../../../store/IStoreState'
import { layoutActions, LayoutAction, layoutFunctions } from '../../../actions/layout.actions';
import { MenuOrientation } from '../../../store/ILayoutState';
import { Toolbox } from '../../../utils/toolbox';
import { history } from '../../../utils/app-storage';


interface AppSubMenuProps {
    //self props, they are not stored in redux' s store.
    items?: MenuItem[];
    root?: boolean;
    visible?: boolean;
    //

    menuHoverActive?: boolean;
    layoutMode?: MenuOrientation;
    resetMenu?: boolean;
    overlayMenuActive?: boolean;
    staticMenuMobileActive?: boolean;

    onSubmenuItemClick?: (root: boolean, menuHoverActive: boolean, items, layoutMode: MenuOrientation
        , overlayMenuActive: boolean, staticMenuMobileActive: boolean, history, route:string) => LayoutAction;
}
function mapStateToProps(state: IStoreState): AppSubMenuProps {
    let ret: AppSubMenuProps = {
        menuHoverActive: state.layoutReducer.menuHoverActive,
        layoutMode: state.layoutReducer.layoutMode,
        resetMenu: state.layoutReducer.resetMenu,
        overlayMenuActive: state.layoutReducer.overlayMenuActive,
        staticMenuMobileActive: state.layoutReducer.staticMenuMobileActive,
    };
    return ret;
}

function mapDispatchToProps(dispatch: Dispatch<IStoreState>): AppSubMenuProps {
    const actions: AppSubMenuProps = {
        onSubmenuItemClick: (root: boolean, menuHoverActive: boolean, items, layoutMode: MenuOrientation
            , overlayMenuActive: boolean, staticMenuMobileActive: boolean,  history, route:string) => dispatch(layoutActions.onSubmenuItemClick(root, menuHoverActive,
                items, layoutMode, overlayMenuActive, staticMenuMobileActive, history, route))
    };
    return actions;
}

interface AppSubMenuState {
    activeIndex?: number;
}


class AppSubMenuComponent extends React.Component<AppSubMenuProps, AppSubMenuState> {
    constructor(props: AppSubMenuProps) {
        super(props);

        this.state = {};
    }


    isActive = (index: number): boolean => {
        return this.state.activeIndex === index;
    };


    onMouseEnter = (index: number) => {
        const { root, menuHoverActive, layoutMode } = this.props;
        if (root && menuHoverActive && (layoutFunctions.isHorizontal(layoutMode) || layoutFunctions.isSlim(layoutMode))
            && !Toolbox.isMobile() && !Toolbox.isTablet()) {
            this.setState({ activeIndex: index });
        }
    };

    itemClick = (event, child: MenuItem, index: number) => {

        // avoid processing disabled items
        if (child.disabled) {
            event.preventDefault();
            return true;
        }

        // activate current item and deactivate active sibling if any
        this.setState((prevState, props) => ({
            activeIndex: prevState.activeIndex === index ? null : index
        }));


        // prevent hash change
        if (child.items || (!child.url && !child.route)) {
            // setTimeout(() => {
            // this.app.layoutMenuScrollerViewChild.moveBar();
            // }, 450);
            event.preventDefault();
        }

        const { items, root, menuHoverActive, layoutMode, overlayMenuActive, staticMenuMobileActive, onSubmenuItemClick } = this.props;

        onSubmenuItemClick(root, menuHoverActive, items, layoutMode, overlayMenuActive, staticMenuMobileActive,history, child.route);

        return false;
    }

    render() {
        const { items, root, visible, layoutMode, ...rest } = this.props;
        let elements = [];
        items.map((child, index) => {
            if (!(child.visible === false)) {
                elements.push(
                <li key={child.label} className={(this.isActive(index) ? "active-menuitem" : "")}>
                    <a onClick={(e) => this.itemClick(e, child, index)} onMouseEnter={() => this.onMouseEnter(index)} className="ripplelink"
                        tabIndex={!visible ? -1 : null} target={child.target} style={{cursor:"pointer"}}>

                        {child.icon &&
                            <i className="material-icons">{child.icon}</i>
                        }
                        <span>{child.label}</span>
                        {
                            child.badge &&
                            <span className="menuitem-badge">{child.badge}</span>
                        }
                        {
                            child.items &&
                            <i className="material-icons submenu-icon">keyboard_arrow_down</i>
                        }
                    </a>

                     <div className="layout-menu-tooltip">
                        <div className="layout-menu-tooltip-arrow"></div>
                        <div className="layout-menu-tooltip-text">{child.label}</div>
                    </div> 
                    
                    {(child.items&&child.items.length)&&
                    <ul className={(layoutFunctions.isSlim(layoutMode)||layoutFunctions.isHorizontal(layoutMode))&&root ? this.isActive(index) ?
                        'visible' : 'hidden' : this.isActive(index) ? 'visibleAnimated' : 'hiddenAnimated'}>
                        <AppSubMenuComponent  items={child.items} root={false} visible={this.isActive(index)} {...rest} />
                    </ul>
                    }
                </li>

                );
            }
        });

        return elements
    }
}


const connectedAppSubMenuComponent: any = connect(mapStateToProps, mapDispatchToProps)(AppSubMenuComponent);
export { connectedAppSubMenuComponent as AppSubMenuComponent };

export interface MenuItem {
    badgeStyleClass?: any;
    visible?: boolean;
    url?: string;
    route?: string;
    target?: string;
    icon?: string;
    label?: string;
    badge?: string;
    items?: MenuItem[];
    disabled?: boolean;
}

