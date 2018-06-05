
import { Action } from 'redux';
import { ILayoutState, MenuOrientation } from '../store/ILayoutState';
import { Toolbox } from '../utils/toolbox';

export const layoutActions = { //all of them are action creators
    onMenuButtonClick,
    onRightPanelButtonClick,
    onTopbarMenuButtonClick,
    onTopbarItemClick,
    onMenuClick,
    onLayoutClick,
    onRightPanelClick,
    onSubmenuItemClick
};

export const layoutFunctions = {
    isOverlay,
    isHorizontal,
    isSlim
};

function onMenuButtonClick(rotateMenuButton: boolean, layoutMode: MenuOrientation, overlayMenuActive:boolean, isDesktop: boolean
, staticMenuDesktopInactive: boolean, staticMenuMobileActive: boolean): LayoutAction {//app.onMenuButtonClick()
    let ret : LayoutAction = 
    {
        type: LayoutActionType.ON_MENU_BUTTON_CLICK,
        menuClick:true,
        rotateMenuButton: !rotateMenuButton,
        topbarMenuActive: false,
        overlayMenuActive: (layoutMode === MenuOrientation.OVERLAY ? !overlayMenuActive:overlayMenuActive),
        staticMenuDesktopInactive: (isDesktop ? !staticMenuDesktopInactive:staticMenuDesktopInactive),
        staticMenuMobileActive: (!isDesktop ? !staticMenuMobileActive:staticMenuMobileActive)
    };

    return ret;
}

function onRightPanelButtonClick(rightPanelActive:boolean): LayoutAction {
    return {
        type: LayoutActionType.ON_RIGHT_PANEL_BUTTON_CLICK,
        rightPanelClick:false,
        rightPanelActive:!rightPanelActive
    };
}

function onTopbarMenuButtonClick(topbarMenuActive: boolean): LayoutAction {
    let action: LayoutAction = {
        type: LayoutActionType.ON_TOPBAR_MENU_BUTTON_CLICK,
        topbarItemClick:false,
        topbarMenuActive:topbarMenuActive
    };

    hideOverlayMenu(action);
    return action;
}

function onTopbarItemClick(oldActiveTopbarItem: string,  newActiveTopbarItem: string): LayoutAction {
    const activeTopbarItem = oldActiveTopbarItem === newActiveTopbarItem ? null : newActiveTopbarItem;
    const ret: LayoutAction =
        {
            type: LayoutActionType.ON_TOPBAR_ITEM_CLICK,
            topbarItemClick:true,
            activeTopbarItem: activeTopbarItem
        }
    return ret;
}

function onMenuClick(): LayoutAction {
    return {
        type: LayoutActionType.ON_MENU_CLICK,
        menuClick: true,
        resetMenu: false
    }
}

function onLayoutClick(topbarItemClick: boolean, menuClick: boolean, layoutMode: MenuOrientation
, overlayMenuActive: boolean, staticMenuMobileActive: boolean, rightPanelClick: boolean): LayoutAction {

    let action: any = {};

    if (!topbarItemClick) {
        action.activeTopbarItem = null;
        action.topbarMenuActive = false;
    }

    if (!menuClick) {
        if (isHorizontal(layoutMode) || isSlim(layoutMode)) {
            action.resetMenu = true;
        }

        if (overlayMenuActive || staticMenuMobileActive) {
            hideOverlayMenu(action);
        }

        action.menuHoverActive = false;
    }

    if (!rightPanelClick) {
        action.rightPanelActive = false;
    }

    action.topbarItemClick = false;
    action.menuClick = false;
    action.rightPanelClick = false;


    let ret : LayoutAction = {
        type: LayoutActionType.ON_LAYOUT_CLICK
    }

    return Toolbox.copyShallow<LayoutAction>(ret, action);
}

function onRightPanelClick(): LayoutAction{
    return {
        type:LayoutActionType.ON_RIGHT_PANEL_CLICK,
        rightPanelClick:true
    }
}

function onSubmenuItemClick(root:boolean, menuHoverActive:boolean, items, layoutMode: MenuOrientation
, overlayMenuActive: boolean, staticMenuMobileActive:boolean, history, route:string): LayoutAction{
    let action: any = {};

    if (root) {
        action.menuHoverActive = !menuHoverActive;
    }


    // hide menu
    if (!items) {
        if (isHorizontal(layoutMode) || isSlim(layoutMode)) {
            action.resetMenu = true; 
        } else {
            action.resetMenu = false; 
        }

        action.overlayMenuActive = false;
        action.staticMenuMobileActive = false;
        action.menuHoverActive = !action.menuHoverActive;
    }
    
    if (route)
        history.push('/' + route);

    let ret : LayoutAction = {
        type: LayoutActionType.ON_LAYOUT_CLICK
    }



    return Toolbox.copyShallow<LayoutAction>(ret, action);
}




function hideOverlayMenu(action) {
    action.rotateMenuButton = false;
    action.overlayMenuActive = false;
    action.staticMenuMobileActive = false;
}

function isOverlay(layoutMode: MenuOrientation) {
    return layoutMode === MenuOrientation.OVERLAY;
}

function isHorizontal(layoutMode: MenuOrientation) {
    return layoutMode === MenuOrientation.HORIZONTAL;
}

function isSlim(layoutMode: MenuOrientation) {
    return layoutMode === MenuOrientation.SLIM;
}

export interface LayoutAction extends ILayoutState, Action {
}

export enum LayoutActionType {
    ON_MENU_BUTTON_CLICK = "ON_MENU_BUTTON_CLICK",
    ON_RIGHT_PANEL_BUTTON_CLICK = "ON_RIGHT_PANEL_BUTTON_CLICK",
    ON_TOPBAR_MENU_BUTTON_CLICK = "ON_TOPBAR_MENU_BUTTON_CLICK",
    ON_TOPBAR_ITEM_CLICK = "ON_TOPBAR_ITEM_CLICK",
    ON_MENU_CLICK = "ON_MENU_CLICK",
    ON_LAYOUT_CLICK = "ON_LAYOUT_CLICK",
    ON_RIGHT_PANEL_CLICK= "ON_RIGHT_PANEL_CLICK",

    ON_SUBMENU_ITEM_CLICK = "ON_SUBMENU_ITEM_CLICK"
}

