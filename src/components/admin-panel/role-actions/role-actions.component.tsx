
import * as React from 'react';
import { ComponentBase } from '../../component-base';
import { Role, TreeNode, SaveRoleActionsModel } from '../../../models/entities';
import { AdminPanelService } from '../../../services/admin-panel.service';
import { Button } from 'primereact/components/button/Button';
import {Panel} from 'primereact/components/panel/Panel';
import {RadioButton} from 'primereact/components/radiobutton/RadioButton';
import {TreeTable} from 'primereact/components/treetable/TreeTable';
import { Toolbox } from '../../../utils/toolbox';
import { Column } from 'primereact/components/column/Column';
import { Checkbox } from 'primereact/components/checkbox/Checkbox';
import {Tree} from 'primereact/components/tree/Tree';


interface RoleActionsProps { }
interface RoleActionsState {
    roles?: Role[];
    selectedValue?: string;
    roleActions?: TreeNode[];
    selectedRole?: Role;
}

export class RoleActionsComponent extends ComponentBase<RoleActionsProps, RoleActionsState> {

    private adminPanelService: AdminPanelService;
    constructor(props) {
        super(props);

        this.state = { roles: null, selectedValue: null, roleActions: null, selectedRole: null };

        this.adminPanelService = new AdminPanelService();
    }

    componentWillMount() {
        this.dataBind();
    }

    private dataBind = () => {
        this.adminPanelService.getRolesNoAdmin().then(data => {
            this.setState({ roles: data });
        });
    };

    roleChanged = (role:Role) => {
        if (role && role.Id && role.Id > 0) {
            const selectedRole = role;
            this.adminPanelService.getApiActionsHierarchical(role.Name).then(data => {
                const roleActions = data;
                this.setState({ selectedRole: selectedRole, roleActions: roleActions });
            });
        }
    };

    //primeng de tree yapısı expand olunca parent ekliyor.
    private setParentNull = () => {
        const { roleActions } = this.state;
        let index = 0;
        for (let item of roleActions) {
            if (item.children) {
                let childIndex = 0;
                for (let child of item.children) {
                    child.parent = null;
                }
            }
            ++index;
        }
    }

    onSave = (e) =>{
        const {roleActions,selectedRole } = this.state;
        this.setParentNull();
        const temp: SaveRoleActionsModel = {};
        temp.Data = roleActions;// this.postModelRoleActions;
        temp.RoleName = selectedRole.Name;
        temp.Type = 1;//1 === web api
        this.adminPanelService.saveActionRoles(temp).then(data => {
            Toolbox.showSuccess("Saved");
        });
    };

    onDeleteUnused = (e)  => {
        this.adminPanelService.clearUnusedRoleActions().then(data => {
            Toolbox.showSuccess("Deleted unused record count: " + data);
        });
    };

    onCheckboxSelectionChange = (e) => {
        const {roleActions} = this.state;
        const nodes:TreeNode[] = e.selection;
        roleActions.forEach(i => {
            i.checked = nodes.filter(p => p.label===i.label).length > 0;
        })
        this.setState({roleActions:roleActions});
    }


    render() {

        const {roleActions, roles, selectedValue} = this.state;

      //  alert(JSON.stringify(roles));

        return (
            <React.Fragment>
                <h3 className="captionH3" ><span className="captionSpan" style={{ "color": "#365073", "margin": "15px", "fontSize": "24px" }}>Web Api Authorization</span></h3>

                <div className="Container100 ui-fluid">
                    <div className="ContainerIndent">
                        <div className="Card ShadowEffect">
                            <div className="ui-grid ui-grid-responsive ui-grid-pad">
                                <div className="ui-grid-row">
                                    <div className="ui-grid-col-3">
                                    <Button type="button" label="Save" icon="ui-icon-save" onClick={this.onSave} disabled={!roleActions} />
                                    </div>
                                    <div className="ui-grid-col-3">
                                    <Button type="button" label="Delete" icon="ui-icon-delete" className="orange-btn" onClick={this.onDeleteUnused} />
                                    </div>
                                </div>
                                <div className="ui-grid-row">
                                    <div className="ui-grid-col-3">
                                        {roles && <Panel header={"Roles"} toggleable={false}>
                                            {
                                                roles.map(role => {
                                                    return (<div className="ui-grid-row">
                                                        <div className="ui-grid-col-1">
                                                            <RadioButton key={role.Id.toString()} onChange={(e) => this.roleChanged(role)} name="group1" value={role.Id.toString()} checked={selectedValue === role.Id.toString()}>
                                                            </RadioButton>
                                                        </div>
                                                        <div className="ui-grid-col-11">
                                                            <label className="ui-widget">{role.Name}</label>
                                                        </div>
                                                    </div>)
                                                })
                                            }

                                        </Panel>}
                                    </div>
                                    <div className="ui-grid-col-9">
                                    <Panel header={"Web Api Actions"}>
                                            {roleActions&&
                                            <Tree value={roleActions} selectionMode="checkbox" selectionChange={this.onCheckboxSelectionChange}></Tree>}
                                    </Panel>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}