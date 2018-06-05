import * as React from 'react';
import { ComponentBase } from '../../component-base';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Button } from 'primereact/components/button/Button';
import { AppSetting } from '../../../models/entities';
import { Column } from 'primereact/components/column/Column';
import { AdminPanelService } from '../../../services/admin-panel.service';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Checkbox } from 'primereact/components/checkbox/Checkbox';
import { Toolbox } from '../../../utils/toolbox';
import { UtilsService } from '../../../services/utils.service';
import { AppStorage } from '../../../utils/app-storage';

interface AppSettingsProps { }
interface AppSettingsState {
    appSettingList?:AppSetting[];
}

export class AppSettingsComponent extends ComponentBase<AppSettingsProps, AppSettingsState> {

    private adminPanelService:AdminPanelService;
    private utilsService: UtilsService
    constructor(props){
        super(props);

        this.state = {appSettingList:null};

        this.adminPanelService = new AdminPanelService();
        this.utilsService = new UtilsService();
    }

    dataBind = () => {
        this.adminPanelService.getAppSettingList().then(data => {
            this.setState({appSettingList:data});
        });
    };

    componentWillMount(){
        this.dataBind();
    }

    onRowTextChange(data, field, e){
        data[field] = e.target.value;
        this.setState(prev => ({appSettingList:prev.appSettingList}));
    }
    rowTemplate(rowData, column, field) {
        return <InputText value={rowData[field]} onChange={(e)=>{this.onRowTextChange(rowData, field, e)}} />
    }

    onRowCheckChange(data, field, e){
        data[field] = e.checked;
        this.setState(prev => ({appSettingList:prev.appSettingList}));
    }
    rowCheckTemplate(rowData, column, field) {
        return <Checkbox checked={rowData[field]} onChange={(e)=>{this.onRowCheckChange(rowData, field, e)}}  />
    }

    onSave = (e) =>{
        const {appSettingList} = this.state;
        if (appSettingList && appSettingList.length) {
            this.adminPanelService.updateAllAppSetting(appSettingList).then(data => {
                if (data > 0) {
                    this.dataBind();
                    Toolbox.showSuccess("Saved");
                }
                else
                    Toolbox.showError("Save operation could not be completed");
            });
        } else {
            Toolbox.showError("No such a settings attribute.");
        }
    };

    onReset = (e) =>{
        this.utilsService.resetServerApp().then(data => {
            AppStorage.logout();
        });
    };

    render() {

        const gridHeader = <div className="ui-grid-row">
            <div className="ui-grid-col-2">
                <Button type="button" icon="ui-icon-save" label="Save" onClick={this.onSave}></Button>
            </div>
            <div className="ui-grid-col-2">
                <Button type="button" icon="ui-icon-save" label="Reset" onClick={this.onReset} className={"green-btn"}></Button>
            </div>
            <div className="ui-grid-col-8">Settings</div>
        </div>;

        const {appSettingList} = this.state;

        return (
            <React.Fragment>
                <h3 className="captionH3" ><span className="captionSpan">Application Settings</span></h3>

                <div className="Container100 ui-fluid">
                    <div className="ContainerIndent">
                        <div className="Card ShadowEffect">
                            <h2 className="BigTopic"></h2>
                            <DataTable value={appSettingList} header={gridHeader}>
                                <Column field="Name" header="Name" sortable={true} filter={true} filterMatchMode={"contains"} />
                                <Column header="Value" body={(r,c) => this.rowTemplate(r, c, "Value")} />
                                <Column field="DefaultValue" header="Default Value" sortable={true} filter={true} filterMatchMode={"contains"} />
                                <Column field="Description" header="Description" sortable={true} filter={true} filterMatchMode={"contains"} />
                                <Column header="Module" body={(r,c) => this.rowTemplate(r, c, "Module")} />
                                <Column header="Enabled" filterMatchMode={"contains"} body={(r,c) => this.rowCheckTemplate(r, c, "Enabled")} />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}