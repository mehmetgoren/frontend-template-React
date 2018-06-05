import * as React from 'react';
import { ComponentBase } from '../../component-base';
import { Role } from '../../../models/entities';
import { AdminPanelService } from '../../../services/admin-panel.service';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Button } from 'primereact/components/button/Button';
import { Column } from 'primereact/components/column/Column';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { FormX } from '../../widgets/formx';
import { createValidators } from '../../../utils/validation/validation';
import { Types } from '../../../actions/metadata.actions';
import { InputX } from '../../widgets/inputx';
import { CheckboX } from '../../widgets/checkbox';
import { ButtonX } from './../../widgets/buttonx';
import { Toolbox } from '../../../utils/toolbox';

interface RolesProps { }
interface RolesState {
    roles?: Role[];
    selected?: Role;
    isAdmin?: boolean;
    displayDialog?: boolean;
}

export class RolesComponent extends ComponentBase<RolesProps, RolesState> {

    private adminPanelService: AdminPanelService;
    constructor(props) {
        super(props);

        this.state = { roles: null, selected: null, isAdmin: false, displayDialog: false };
        this.adminPanelService = new AdminPanelService();
    }

    componentWillMount() {
        this.dataBind();
    }

    dataBind = () => {
        this.adminPanelService.getRoles().then(data => {
            this.setState({ roles: data });
        });
    }

    onAddNewRecord = (e) => {
        this.setState({ selected: {}, displayDialog: true });
    };
    onModelChanged = (model: Role) => {
        this.setState({ selected: model });
    };

    onSave = e => {
        e.preventDefault();
        const { selected } = this.state;
        this.adminPanelService.saveRole(selected).then(data => {
            if (data > 0) {
                this.dataBind();
                this.setState({ displayDialog: false });
                Toolbox.showSuccess("Rol Kayıt Edildi");
            }
            else
                Toolbox.showError("Rol Kayıt Edilemedi");
        });
    };


    render() {
        const validators = createValidators(Types.Role, ['Name', 'IsAdmin']);

        const { roles, selected, displayDialog } = this.state;

        const gridHeader = <div className="ui-grid-row">
            <div className="ui-grid-col-2"><Button type="button" icon="ui-icon-add" onClick={this.onAddNewRecord} label="Add New Record"></Button></div>
            <div className="ui-grid-col-10">Roller</div>
        </div>;

        return (
            <React.Fragment>
                <h3 className="captionH3" ><span className="captionSpan" style={{ "color": "#365073", "margin": "15px", "fontSize": "24px" }}>Roles</span></h3>


                <div style={{ "marginTop": "5px", "marginRight": "50px" }}>

                    <DataTable value={roles} rows={10} paginator={true} pageLinkSize={5} rowsPerPageOptions={[5, 10, 20]} responsive={true}
                        selectionMode={"single"} selection={selected} onSelectionChange={(e) => this.setState({ selected: e.data, displayDialog: true })} header={gridHeader}>
                        <Column body={this.rowNumTemplate} style={{ textAlign: 'center', width: '5%' }} />
                        <Column field={"Name"} header={"Name"} />
                        <Column field={"IsAdmin"} header={"Admin?"} />

                    </DataTable>

                </div>

                <Dialog visible={displayDialog} header="Role Details" modal={true}
                    resizable={false} closeOnEscape={true} width={"525px"}
                    onHide={() => this.setState({ displayDialog: false, selected: null })}>
                    {selected &&
                        <FormX model={selected} validators={validators} onModelChanged={this.onModelChanged}>
                            <div className="ui-fluid">
                                <div className="ui-g">
                                    <div className="ui-g-12">

                                        <div className="ui-g-12 ui-md-4">
                                            <label>Name</label>
                                        </div>
                                        <div className="ui-g-12 ui-md-8">
                                            <InputX field={"Name"} />
                                        </div>

                                        <div className="ui-g-12 ui-md-4">
                                            <label>Admin ?</label>
                                        </div>
                                        <div className="ui-g-12 ui-md-8">
                                            <CheckboX field={"IsAdmin"} />
                                        </div>

                                        <div className="ui-g-12 ui-md-4">
                                        </div>
                                        <div className="ui-g-12 ui-md-8">
                                            <ButtonX label="Save" icon="fa-check" onClick={this.onSave} />
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </FormX>}

                </Dialog>


            </React.Fragment>
        )
    }

}