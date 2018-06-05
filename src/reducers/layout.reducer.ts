import { ILayoutState, MenuOrientation } from '../store/ILayoutState';
import { LayoutAction, LayoutActionType } from '../actions/layout.actions';

export function layoutReducer(state = defaultState, action: LayoutAction): ILayoutState {
    switch (action.type) {
        case LayoutActionType.ON_MENU_BUTTON_CLICK:
            return {
                ...state,
                menuClick: action.menuClick,
                rotateMenuButton: action.rotateMenuButton,
                topbarMenuActive: action.topbarMenuActive,
                overlayMenuActive: action.overlayMenuActive,
                staticMenuDesktopInactive: action.staticMenuDesktopInactive,
                staticMenuMobileActive: action.staticMenuMobileActive
            };
        case LayoutActionType.ON_TOPBAR_MENU_BUTTON_CLICK:
            return {
                ...state,
                topbarItemClick: action.topbarItemClick,
                topbarMenuActive: action.topbarMenuActive,
                rotateMenuButton: action.rotateMenuButton,
                overlayMenuActive: action.overlayMenuActive,
                staticMenuMobileActive: action.rightPanelClick
            };
        case LayoutActionType.ON_TOPBAR_ITEM_CLICK:
            return {
                ...state,
                topbarItemClick: action.topbarItemClick,
                activeTopbarItem: action.activeTopbarItem
            };
        case LayoutActionType.ON_MENU_CLICK:
            return {
                ...state,
                menuClick: action.menuClick,
                resetMenu: action.resetMenu
            };
        case LayoutActionType.ON_RIGHT_PANEL_BUTTON_CLICK:
            return { 
                ...state, 
                rightPanelClick: action.rightPanelClick, 
                rightPanelActive: action.rightPanelActive 
            };
        case LayoutActionType.ON_LAYOUT_CLICK:
            return {
                ...state,
                activeTopbarItem: action.activeTopbarItem,
                topbarMenuActive: action.topbarMenuActive,
                resetMenu: action.resetMenu,
                menuHoverActive: action.menuHoverActive,
                rightPanelActive: action.rightPanelActive,
                topbarItemClick: action.topbarItemClick,
                menuClick: action.menuClick,
                rightPanelClick: action.rightPanelClick
            };
        case LayoutActionType.ON_SUBMENU_ITEM_CLICK:
            return {
                ...state,
                menuHoverActive:action.menuHoverActive,
                resetMenu:action.resetMenu,
                overlayMenuActive:action.overlayMenuActive,
                staticMenuMobileActive:action.staticMenuMobileActive     
            };
        default:
            return state;
    }
}

const defaultState: ILayoutState = {
    layoutCompact: true,
    layoutMode: MenuOrientation.STATIC,

    menuClick: false,
    rotateMenuButton: false,
    topbarMenuActive: false,//profile tıklaması

    overlayMenuActive: false,
    staticMenuDesktopInactive: false,
    staticMenuMobileActive: false,

    rightPanelClick: false,
    rightPanelActive: false,

    topbarItemClick: false,

    activeTopbarItem: null,

    profileMode: "inline",
    menuHoverActive: false,
    resetMenu: false,
}