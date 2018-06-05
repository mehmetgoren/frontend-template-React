import './menu.component.css';
import * as React from 'react';
import { ComponentBase } from '../../component-base';

import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Button } from 'primereact/components/button/Button';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { Growl } from 'primereact/components/growl/Growl';

import { AdminPanelService } from '../../../services/admin-panel.service';

import { V_Menu } from './../../../models/entities';
import { Toolbox } from '../../../utils/toolbox';
import { Validators } from '../../../utils/validation/validators';
import { Types } from '../../../actions/metadata.actions';
import { createValidators } from '../../../utils/validation/validation';
import { FormX } from '../../widgets/formx';
import { InputX } from '../../widgets/inputx';
import { DropdownX } from '../../widgets/dropdownx';
import { ButtonX } from '../../widgets/buttonx';
import { CheckboX } from '../../widgets/checkbox';



interface MenuProps { }//Props read-only modda çalışır, sadece üst component’in verdiği bilgiyi alt component’e taşır.
interface MenuState {//state ise component içindeki durum bilgisini saklar. 
    //Örneğin ekran üzerinde herhangi bir checkbox’ı tıkladınız. Tıkladığınız bilgisini bir state’e bağlarsanız, state bilgisi her checkbox seçiminizde değişecektir.
    // Dolayısı ile state, component içinde herhangi bir şey üzerine durum bilgisi tutan, read-only olmayan bir tanımlamadır.
    menuList?: V_Menu[],
    selected?: V_Menu;
    displayDialog?: boolean;
    sortable?: boolean;
    filter?: boolean;
}

export class MenuComponent extends ComponentBase<MenuProps, MenuState> {
    adminPanelService: AdminPanelService;
    constructor(props: MenuProps) {
        super(props);
        this.state = { menuList: [], sortable: true, filter: true };

        this.adminPanelService = new AdminPanelService();
    }


    componentDidMount() {
        this.dataBind();
    }

    dataBind = () => {
        this.adminPanelService.getMenus().then(data => {
            this.setState({ menuList: data });
        });
    };

    changeSortable = (e) => {
        //console.log(JSON.stringify(Object.getOwnPropertyNames(e)));
        const { sortable, filter } = this.state;
        this.setState(() => ({ sortable: !sortable, filter: !filter }));
    };

    onModelChanged = (model: V_Menu) => {
        this.setState({ selected: model });
    };


    onSave = (e) => {
        e.preventDefault();

        const { selected } = this.state;

        if (!selected.Image) {
            selected.Image = selected.ParentId ? "fiber_manual_record" : "settings_application";
        }

        this.adminPanelService.saveMenu(selected).then(data => {
            if (data > 0) {
                this.dataBind();
                this.growl.show({ severity: 'info', detail: "Saved" });
            }
            else
                this.growl.show({ severity: 'warning', detail: "Changes can not be saved" });
        });

        this.setState({ displayDialog: false });
    };

    growl;
    render() {
        const validators = createValidators(Types.Menu, ['ParentId', 'Name', 'Controller', 'Action', 'Route', 'OrderNum', 'Visible', 'Image']);

        const { menuList, selected, displayDialog, sortable, filter } = this.state;
        const menuSelectItemList = Toolbox.toSelectItemList(menuList, "Id", "Name", { value: null, label: "None" }).filter(p => !Toolbox.isUndefinedOrNull(p.label));

        const header = <div className="ui-helper-clearfix" style={{ lineHeight: '1.87em' }}>
            <Button style={{ float: 'left' }} icon="ui-icon-add-box" label="Add New Record" />
            Menus</div>;

        return (
            <React.Fragment>
                <div className="container">
                    <Growl ref={(el) => { this.growl = el; }}></Growl>
                    <Button label={sortable ? "make non sortable" : "make sortable"} onClick={this.changeSortable} />
                    <DataTable value={menuList} selectionMode="single" header={header}
                        selection={selected} onSelectionChange={(e) => this.setState({ selected: e.data, displayDialog: true })}
                        paginator={true} rows={20} rowsPerPageOptions={[10, 20, 50]}>
                        <Column field="Name" header="Name" sortable={sortable} filter={filter} />
                        <Column field="Route" header="Route" sortable={sortable} filter={filter} />
                        <Column field="OrderNum" header="Order Num" sortable={sortable} filter={filter} />
                        <Column field="ParentName" header="Parent Name" sortable={sortable} filter={filter} />
                        <Column field="Visible" header="Visible" sortable={sortable} filter={filter} />
                        <Column field="Image" header="Image" sortable={sortable} filter={filter} />
                    </DataTable>

                    <Dialog visible={displayDialog} header="Car Details" modal={true}
                        // footer={dialogFooter}
                        onHide={() => this.setState({ displayDialog: false, selected: null })}>
                        {selected &&
                            <FormX model={selected} onModelChanged={this.onModelChanged} validators={validators} style={{ width: "450px", height: "275px" }}>
                                <div className="ui-fluid">
                                    <div className="ui-g">
                                        <div className="ui-g-12">

                                            <div className="ui-g-12 ui-md-3">
                                                <label>Parent Menu</label>
                                            </div>
                                            <div className="ui-g-12 ui-md-9">
                                                <DropdownX field={"ParentId"} options={menuSelectItemList} style={{ width: '100%' }} placeholder="Select a Parent Menu" />
                                            </div>

                                            <div className="ui-g-12 ui-md-3">
                                                <label>Menu</label>
                                            </div>
                                            <div className="ui-g-12 ui-md-9">
                                                <InputX id="txtName" field={"Name"} />
                                            </div>

                                            <div className="ui-g-12 ui-md-3">
                                                <label>Route</label>
                                            </div>
                                            <div className="ui-g-12 ui-md-9">
                                                <InputX field={"Route"} />
                                            </div>

                                            <div className="ui-g-12 ui-md-3">
                                                <label>Order Number</label>
                                            </div>
                                            <div className="ui-g-12 ui-md-9">
                                                <InputX type="number" field={"OrderNum"} />
                                            </div>

                                            <div className="ui-g-12 ui-md-3">
                                                <label>Visible</label>
                                            </div>
                                            <div className="ui-g-12 ui-md-9">
                                                <CheckboX field={"Visible"} />
                                            </div>

                                            <div className="ui-g-12 ui-md-3">
                                                <label>Image</label>
                                            </div>
                                            <div className="ui-g-12 ui-md-9">
                                                <InputX field={"Image"} />
                                            </div>

                                            <div className="ui-g-12 ui-md-9">
                                            </div>
                                            <div className="ui-g-12 ui-md-3">
                                                <ButtonX label="Save" icon="fa-check" onClick={this.onSave} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </FormX>
                        }
                    </Dialog>
                </div>
            </React.Fragment>
        );
    }
}


