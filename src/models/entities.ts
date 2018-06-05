export interface Action { 
    Id?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    ControllerId?: number;
    Name?: string;
}

export interface AppSetting { 
    Name?: string;
    Value?: string;
    DefaultValue?: string;
    Description?: string;
    Module?: string;
    Enabled?: boolean;
}

export interface AppUser { 
    Id?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    IpAddress?: string;
    RoleId?: number;
    Username?: string;
    Password?: string;
    LoginCount?: number;
    Title?: string;
    KisiId?: number;
}



export interface ChartModel { 
    labels?: string[];
    datasets?: ChartModelDataSet[];
}

export interface ChartModelDataSet { 
    data?: any[];
    backgroundColor?: string[];
    hoverBackgroundColor?: string[];
    label?: string;
    borderColor?: string;
}

export interface Controller { 
    Id?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    Name?: string;
    Type?: number;
}

export interface CustomFilter { 
    Field?: string;
    Operator?: any;
    Values?: any[];
    DataType?: any;
}

export interface Field { 
    ColumnName?: string;
    IsKey?: boolean;
    IsNullable?: boolean;
    MaxLength?: number;
    ReadOnly?: boolean;
    RegularExpression?:string;
    JsType?:string;
}





export interface IsoDateTimeConverterTR { 
    DateTimeStyles?: any;
    DateTimeFormat?: string;
    Culture?: any;
    CanRead?: boolean;
    CanWrite?: boolean;
}

export interface ITreeObject { 
    Id?: number;
    ParentId?: number;
}

export interface ITreeObject { 
    Children?: any[];
}



export interface Menu { 
    Id?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    Name?: string;
    Controller?: string;
    Action?: string;
    Route?: string;
    Description?: string;
    OrderNum?: number;
    ParentId?: number;
    Visible?: boolean;
    Image?: string;
    Childs?: Menu[];
}

export interface Role { 
    Id?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    Name?: string;
    IsAdmin?: boolean;
}

export interface RoleAction { 
    Id?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    RoleId?: number;
    ActionId?: number;
    Enabled?: boolean;
}

export interface RoleMenu { 
    Id?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    RoleId?: number;
    MenuId?: number;
    HasAccess?: boolean;
}

export interface SaveRoleActionsModel { 
    RoleName?: string;
    Type?: number;
    Data?: TreeNode[];
}

export interface SearchParams { 
    Request?: SearchRequest;
    Take?: number;
    Page?: number;
    Sort?: any[];
}

export interface SearchRequest { 
    TypeFullName?: string;
    EntityJson?: string;
    CustomFilters?: CustomFilter[];
}

export interface SearchSortRequest { 
    field?: string;
    dir?: string;
}

export interface SelectItem { 
    value?: any;
    label?: string;
}

export interface ServerInfo { 
    OsVersion?: string;
    ProcessorCount?: number;
    CpuUsage?: number;
    MemoryUsage?: number;
    DiskUsage?: number;
    ActiveUserCount?: number;
}

export interface SimpleDateTimeConverter { 
    CanRead?: boolean;
    CanWrite?: boolean;
}

export interface SimpleDateTimeConverter2 { 
    CanRead?: boolean;
    CanWrite?: boolean;
}

export interface TreeNode { 
    label?: string;
    data?: any;
    icon?: string;
    expandedIcon?: string;
    collapsedIcon?: string;
    children?: TreeNode[];
    leaf?: boolean;
    expanded?: boolean;
    type?: string;
    parent?: TreeNode;
    partialSelected?: boolean;
    checked?: boolean;
}



export interface UserLocal { 
    Name?: string;
    RoleId?: number;
    Role?: Role;
    Person?: any[];
    Token?: string;
}

export interface V_AppUser { 
    RoleName?: string;
    IsAdmin?: boolean;
    Id?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    IpAddress?: string;
    RoleId?: number;
    Username?: string;
    Password?: string;
    LoginCount?: number;
    Title?: string;
    KisiId?: number;
}

export interface V_Menu { 
    ParentName?: string;
    Id?: number;
    OpUserId?: number;
    OpDate?: Date;
    OpIp?: string;
    Name?: string;
    Controller?: string;
    Action?: string;
    Route?: string;
    Description?: string;
    OrderNum?: number;
    ParentId?: number;
    Visible?: boolean;
    Image?: string;
    Childs?: Menu[];
}

export interface V_RoleAppUser { 
    RoleId?: number;
    RoleName?: string;
    IsAdmin?: boolean;
    AppUserId?: number;
    Username?: string;
    Password?: string;
    LoginCount?: number;
}

export interface V_RoleControllerAction { 
    RoleId?: number;
    RoleActionId?: number;
    ActionId?: number;
    ControllerId?: number;
    RoleName?: string;
    ControllerName?: string;
    ActionName?: string;
    Enabled?: boolean;
    Type?: number;
    TypeName?: string;
    IsAdmin?: boolean;
}

export interface V_RoleMenu { 
    Id?: number;
    Name?: string;
    Controller?: string;
    Action?: string;
    Route?: string;
    Description?: string;
    OrderNum?: number;
    ParentId?: number;
    Visible?: boolean;
    Image?: string;
    RoleMenuId?: number;
    RoleId?: number;
    HasAccess?: boolean;
    ParentName?: string;
}


