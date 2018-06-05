import * as React from 'react';
import { ComponentBase } from '../../component-base';
import { Panel } from 'primereact/components/panel/Panel';
import { RadioButton } from 'primereact/components/radiobutton/RadioButton';
import { V_RoleMenu, Role } from '../../../models/entities';
import { AdminPanelService } from '../../../services/admin-panel.service';
import { DataTable } from 'primereact/components/datatable/DataTable';
import {ToggleButton} from 'primereact/components/togglebutton/ToggleButton';
import { Button } from 'primereact/components/button/Button';
import { Checkbox } from 'primereact/components/checkbox/Checkbox';
import { Column } from 'primereact/components/column/Column';
import { Toolbox } from '../../../utils/toolbox';

interface RoleMenusProps { }
interface RoleMenusState {
    roles?: Role[];
    vRoleMenus?: V_RoleMenu[];
    selectedRole?: V_RoleMenu;
    selectAll?:boolean;
}

export class RoleMenusComponent extends ComponentBase<RoleMenusProps, RoleMenusState> {

    private adminPanelService: AdminPanelService;
    constructor(props) {
        super(props);

        this.state = { roles: [], vRoleMenus: null, selectedRole: {}, selectAll:false };

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

    onHasAccessChanged = (rowData:V_RoleMenu, e) =>{
        rowData.HasAccess = e.checked;

        this.setState({});
    };
    gridHasAccessTemplate = (rowData:V_RoleMenu, column) =>{
        return <Checkbox checked={rowData.HasAccess} onChange={e => this.onHasAccessChanged(rowData, e)} ></Checkbox>
    }

    gridRowIndexTemplate = (rowData:V_RoleMenu, column) =>{
        return <div style={{"textAlign": "center"}}>{column.rowIndex + 1}</div>
    }

    roleChanged = (role: V_RoleMenu) => {
        if (role && role.Id && role.Id > 0) {
            const selectedRole = role;
            this.adminPanelService.getRoleMenuList(selectedRole.Id).then(data => {
                const vRoleMenus = data;
                this.setState({ selectedRole: selectedRole, vRoleMenus: vRoleMenus });
            });
        }
    };

    onSelectAll = e => {
        const selectAll = e.value;
        const {vRoleMenus} = this.state;
        if (vRoleMenus){
            vRoleMenus.forEach(i => {
                i.HasAccess = selectAll;
            });
        }
        this.setState({vRoleMenus:vRoleMenus, selectAll:e.value});
    };

    onSave = e => {
        const {selectedRole, vRoleMenus} = this.state;
        if (selectedRole && vRoleMenus && vRoleMenus.length > 0) {
            this.adminPanelService.saveRoleMenu(selectedRole.Id, vRoleMenus).then(data => {
                if (data > 0) {
                    Toolbox.showSuccess("Saved");
                }
                else {
                    Toolbox.showError("Save operation can not be completed");
                }
            });
        }
        else
            Toolbox.showError("Pleased select a record");
    };

    render() {
        const { roles, vRoleMenus, selectedRole, selectAll } = this.state;

        const gridHeader = <div className="ui-grid-row">
            <div className="ui-grid-col-2" style={{ "textAlign": "left" }}>
                <ToggleButton checked={selectAll} onLabel={"All"} offLabel={"None"} onChange={this.onSelectAll} onIcon={"ui-icon-done-all"} offIcon={"ui-icon-block"} />
            </div>
            <div className="ui-grid-col-1">
                <Button type={"button"} onClick={this.onSave} icon={"ui-icon-save"} label={"Save"} />
            </div>
        </div>;

        return (
            <React.Fragment>
                <h3 className="captionH3" ><span className="captionSpan" style={{ "color": "#365073", "margin": "15px", "fontSize": "24px" }}>Rol Menu Authorities</span></h3>


                <div className="ui-grid ui-grid-responsive ui-grid-pad">

                    <div className="uı-grid-row">
                        <div className="ui-grid-col-2">
                            <Panel header={"Roles"}>
                                <div className="ui-grid ui-grid-responsive ui-grid-pad">
                                </div>
                                {
                                    roles.map((role, index) => {
                                        return (
                                            <div className="ui-grid-row">
                                                <div className="ui-grid-col-1">
                                                    <RadioButton key={role.Id.toString()} onChange={(e) => this.roleChanged(role)} name="group1" value={role.Id.toString()}
                                                        checked={selectedRole.Id == role.Id}>
                                                    </RadioButton>
                                                </div>
                                                <div className="ui-grid-col-11">
                                                    <label className="ui-widget">{role.Name}</label>
                                                </div>
                                            </div>
                                        );
                                    })
                                }


                            </Panel>
                        </div>
                        <div className="ui-grid-col-10">
                            <Panel header={"Menu List"}>
                                {vRoleMenus&&<DataTable value={vRoleMenus} rows={20} paginator={true} pageLinkSize={5} rowsPerPageOptions={[5, 10, 20, 50]} responsive={true}
                                header={gridHeader}>

                                <Column body={this.gridHasAccessTemplate} />
                                <Column header={"Order"} body={this.gridRowIndexTemplate} />
                                <Column field={"Name"} header={"Name"} filter={true} sortable={true} />
                                <Column field={"Route"} header={"Route"} filter={true} sortable={true} />
                                <Column field={"OrderNum"} header={"Order Num"} filter={true} sortable={true} />
                                <Column field={"Controller"} header={"Controller"} filter={true} sortable={true} />
                                <Column field={"Action"} header={"Action"} filter={true} sortable={true} />

                                </DataTable>}
                            </Panel>
                        </div>
                    </div>

                </div>

            </React.Fragment>
        );
    }
}