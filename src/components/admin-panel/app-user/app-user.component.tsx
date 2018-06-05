//import './app-user.component.css';
import * as React from 'react';

import { ComponentBase } from '../../component-base';
import { AdminPanelService } from '../../../services/admin-panel.service';
import { V_AppUser, SelectItem, Role } from '../../../models/entities';
import { InputX } from '../../widgets/inputx';
import { Toolbox } from '../../../utils/toolbox';
import { DropdownX } from '../../widgets/dropdownx';
import { Button } from 'primereact/components/button/Button';
import { Types } from '../../../actions/metadata.actions';
import { UtilsService } from '../../../services/utils.service';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { createValidators } from '../../../utils/validation/validation';
import { FormX } from '../../widgets/formx';
import { Password } from 'primereact/components/password/Password';
import { ButtonX } from '../../widgets/buttonx';



interface AppUserProps { }
interface AppUserState {
    search?: V_AppUser;
    roles?: Role[];
    list?: V_AppUser[];
    total?: number
    selected?: V_AppUser;
    displayDialog?: boolean;
}

export class AppUserComponent extends ComponentBase<AppUserProps, AppUserState> {
    adminPanelService: AdminPanelService;
    utilsService: UtilsService;
    constructor(props: AppUserProps) {
        super(props);
        this.state = { search: {}, list: [], selected: null, displayDialog: false };

        this.adminPanelService = new AdminPanelService();
        this.utilsService = new UtilsService();
    }

    componentDidMount() {
        this.adminPanelService.getRoles().then(data => {
            this.setState({ roles: data });
        });
    }

    onSearchModelChanged = (model: V_AppUser) => {
        this.setState({ search: model });
    };

    onSelectedModelChanged = (model: V_AppUser) => {
        this.setState({ selected: model });
    };

    onSearch = (e) => {
        if (e)
            e.preventDefault();
        this.onLazyLoad({ rows: 10, first: 0 });

    };

    onLazyLoad = (event) => {
        const { search } = this.state;
        Toolbox.setUpServerSidePagingSearch(this.utilsService, event.rows, event.first, Types.V_AppUser, search, event.sortField, event.sortOrder, event.filters, true).then(
            response => {
                this.setState({ list: response.Data, total: response.Total });
            });
    };


    onSave = (e) => {
        e.preventDefault();
        const { selected } = this.state;
        if (selected) {
            //    alert(JSON.stringify(selected));
            //    return;
            this.adminPanelService.saveAppUser(selected).then(result => {
                this.onSearch(null);
                Toolbox.showSuccess("Saved.");
            });
        }
    };


    render() {

        const gridHeader = <div className="ui-grid-row">
            <div className="ui-grid-col-2">
                <Button type="button" icon="ui-icon-add" label="Add New Record" onClick={(e) => this.setState({ selected: {}, displayDialog: true })}></Button>
            </div>
            <div className="ui-grid-col-10">Search Result</div>
        </div>;

        const { search, roles, list, selected, total, displayDialog } = this.state;
        const rolesAsSelectItemList = Toolbox.toSelectItemList(roles, "Id", "Name", { value: -1, label: "Select an role" });
        const validators = createValidators(Types.AppUser, ['RoleId', 'Username', 'Password']);
        return (
            <React.Fragment>
                <h3 className="captionH3" ><span className="captionSpan">Application User</span></h3>
                <div className="ui-fluid">
                    <div className="ui-g">
                        <div className="ui-g-12">
                            <div className="card card-w-title">
                                <div className="ui-g form-group">

                                    <div className="ui-g-12 ui-md-6">
                                        <span className="md-inputfield">
                                            <InputX model={search} field={"Username"} onModelChanged={this.onSearchModelChanged} />
                                            <label>User Name</label>
                                        </span>
                                    </div>
                                    <div className="ui-g-12 ui-md-6">
                                        <DropdownX model={search} field={"RoleId"} options={rolesAsSelectItemList} onModelChanged={this.onSearchModelChanged} filter={true}
                                            style={{ width: '100%' }} placeholder="Select a role" />
                                    </div>


                                    <div className="ui-g ui-md-3">
                                        <Button type="submit" icon="ui-icon-search" label="Search" onClick={this.onSearch} />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="Container100 ui-fluid">
                    <div className="ContainerIndent">
                        <div className="Card ShadowEffect">
                            <h2 className="BigTopic"></h2>
                            <DataTable value={list} selectionMode="single"
                                selection={selected} onSelectionChange={(e) => this.setState({ selected: e.data, displayDialog: true })}
                                paginator={true} rows={20} rowsPerPageOptions={[10, 20, 50]} header={gridHeader}
                                totalRecords={total}
                                lazy={true} onLazyLoad={this.onLazyLoad}
                            >
                                <Column body={this.rowNumTemplate} style={{ textAlign: 'center' }} />
                                <Column field="Username" header="User Name" sortable={true} />
                                <Column field="RoleName" header="Role Name" sortable={true} />
                                <Column field="IsAdmin" header="Is Admin" sortable={true} />
                                <Column field="LoginCount" header="Login Count" sortable={true} />
                            </DataTable>
                        </div>
                    </div>
                </div>

                <Dialog visible={displayDialog} header="Application User Details" modal={true}
                    // footer={dialogFooter}
                    onHide={() => this.setState({ displayDialog: false, selected: null })}>
                    {selected &&
                        <FormX model={selected} onModelChanged={this.onSelectedModelChanged} validators={validators} style={{ width: "450px", height: "275px" }}>
                            <div className="ui-fluid">
                                <div className="ui-g">
                                    <div className="ui-g-12">

                                        <div className="ui-g-12 ui-md-4">
                                            <label>Role</label>
                                        </div>
                                        <div className="ui-g-12 ui-md-8">
                                            <DropdownX field={"ParentId"} options={rolesAsSelectItemList} style={{ width: '100%' }} placeholder="Select a Role" />
                                        </div>

                                        <div className="ui-g-12 ui-md-4">
                                            <label>User Name</label>
                                        </div>
                                        <div className="ui-g-12 ui-md-8">
                                            <InputX field={"Username"} />
                                        </div>

                                        <div className="ui-g-12 ui-md-4">
                                            <label>Password</label>
                                        </div>
                                        <div className="ui-g-12 ui-md-8">
                                            <Password field={"Password"} />
                                        </div>

                                        <div className="ui-g-12 ui-md-4"></div>
                                        <div className="ui-g-12 ui-md-8">
                                            <ButtonX label="Save" icon="ui-icon-save" onClick={this.onSave} />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </FormX>
                    }
                </Dialog>

            </React.Fragment>
        )
    }
}
