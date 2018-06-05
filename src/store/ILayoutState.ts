
export interface ILayoutState{
    readonly layoutCompact?:boolean;
    readonly layoutMode?:MenuOrientation;

    readonly menuClick?:boolean;
    readonly rotateMenuButton?:boolean;
    readonly topbarMenuActive?:boolean;//profile tıklaması
    readonly overlayMenuActive?:boolean;
    readonly staticMenuDesktopInactive?:boolean;
    readonly staticMenuMobileActive?:boolean;

    readonly rightPanelClick?:boolean;
    readonly rightPanelActive?:boolean;

    readonly topbarItemClick?:boolean;

    readonly activeTopbarItem?:string;//seçili olanların belirlenmesi için.

    readonly profileMode?:string;
    readonly menuHoverActive?:boolean;
    readonly resetMenu?:boolean;
}

export enum MenuOrientation {
    STATIC,
    OVERLAY,
    SLIM,
    HORIZONTAL
};
