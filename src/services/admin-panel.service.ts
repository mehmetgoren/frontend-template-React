import { BaseService } from './base.service';
import { V_Menu, Menu, Role, AppSetting, SaveRoleActionsModel, TreeNode, V_RoleMenu } from '../models/entities';
import { AppUser } from './../models/entities';


export class AdminPanelService extends BaseService{

    getMenus() : Promise<V_Menu[]>{
        return this.getList<V_Menu>("/api/adminpanel/getmenus", true);
    }

    createMenu(roleId:number) : Promise<V_Menu[]>{
        return this.getList<V_Menu>("/api/adminpanel/createmenu?roleId=" + roleId, true);
    }

    saveMenu(menu: Menu): Promise<number> {
        return this.postSingle("/api/AdminPanel/SaveMenu", menu, true);
    };

    getRoles(): Promise<Role[]> {
        return this.getList<Role>("/api/AdminPanel/GetRoles", true);
    }

    saveAppUser(model:AppUser):Promise<number>{
        return this.postSingle("/api/AdminPanel/SaveAppUser", model, true);
    }

    getAppSettingList(): Promise<AppSetting[]> {
        return this.getList("/api/AdminPanel/GetAppSettingList", true);
    }

    updateAllAppSetting(appSettingList: AppSetting[]): Promise<number> {
        return this.postSingle("/api/AdminPanel/UpdateAllAppSetting", appSettingList, true);
    }

    getRolesNoAdmin(): Promise<Role[]> {
        return this.getList("/api/AdminPanel/GetRolesNoAdmin", true);
    }

    //Web Api
    getApiActionsHierarchical(role: string): Promise<TreeNode[]> {
        return this.getList("/api/AdminPanel/GetApiActionsHierarchical?role=" + role, true);
    }

    saveActionRoles(model: SaveRoleActionsModel): Promise<number> {
        return this.postSingle("/api/AdminPanel/SaveActionRoles", model, true);
    }
    clearUnusedRoleActions(): Promise<number> {
        return this.postSingle("/api/AdminPanel/ClearUnusedRoleActions", null, true);
    }
    //Web Api

    getRoleMenuList(roleId: number): Promise<V_RoleMenu[]> {
        return this.getList("/api/AdminPanel/GetRoleMenuList?roleId=" + roleId, true);
    }

    saveRoleMenu(roleId: number, vRoleMenus: V_RoleMenu[]):Promise<number> {
        let ap = { roleId: roleId, vRoleMenus: vRoleMenus };
        return this.postSingle("/api/AdminPanel/SaveRoleMenu", ap, true);
    }

    saveRole(role: Role): Promise<number> {
        return this.postSingle("/api/AdminPanel/SaveRole", role, true);
    };

}