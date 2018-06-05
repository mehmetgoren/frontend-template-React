import * as React from 'react';
import { ComponentBase } from '../../component-base';
import { InputText } from 'primereact/components/inputtext/InputText';
import { ServerInfo, ChartModel } from '../../../models/entities';
import { Button } from 'primereact/components/button/Button';
import { UtilsService } from '../../../services/utils.service';
import { Panel } from 'primereact/components/panel/Panel';
import { Chart } from 'primereact/components/chart/Chart';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';

import { HubConnection } from '@aspnet/signalr-client';
import { AppStorage } from '../../../utils/app-storage';
import { Toolbox } from '../../../utils/toolbox';


interface ServerDashboardProps { }
interface ServerDashboardState {
    info?: ServerInfo;
    cmCpu?: ChartModel;
    cmRam?: ChartModel;
    cmHdd?: ChartModel;

    connectedUserVisible?: boolean;
    connectedUserList?: any[];
}

export class ServerDashboardComponent extends ComponentBase<ServerDashboardProps, ServerDashboardState> {

    private utilsService: UtilsService;
    constructor(props) {
        super(props);

        this.state = { info: {}, cmCpu: null, cmRam: null, cmHdd: null };
        this.utilsService = new UtilsService();
    }

    showActiveUser = e => {
        e.preventDefault();
        this.utilsService.getConnectedUsers()
            .then(data => {
                this.setState({ connectedUserVisible: true, connectedUserList: data });
            });
    }

    private conn: HubConnection;
    componentWillMount(){
        this.conn = new HubConnection(AppStorage.host + "/servermonitoring");

        this.conn.on("notify", (data) => {
            this.setState({info:data.info, cmCpu:data.cmCpu, cmRam:data.cmRam, cmHdd:data.cmHdd});
        });

        this.conn.start().then(() => {
            this.conn.invoke("Start");
        }).catch(err => {
            Toolbox.showError(err);
        });
    }

    render() {
        const { info, cmCpu, cmRam, cmHdd, connectedUserVisible, connectedUserList } = this.state;
        return (
            <React.Fragment>
                <div className="card card-w-title">
                    <h1>Server Infos (Powered by ASP.NET SignalR)</h1>

                    <div className="ui-grid ui-grid-responsive ui-grid-pad">
                        <div className="ui-grid-row">
                            <div className="ui-grid-col-6">

                                <div className="ui-g ui-fluid">
                                    <div className="ui-g-12 ui-lg-12">
                                        <div className="card card-w-title">
                                            <div className="ui-g form-group">

                                                <div className="ui-g-12 ui-md-12">
                                                    <span className="md-inputfield">
                                                        <InputText value={info.ProcessorCount} readOnly />
                                                        <label>Thread Count</label>
                                                    </span>
                                                </div>


                                                <div className="ui-g-12 ui-md-12">
                                                    <span className="md-inputfield">
                                                        <InputText value={info.CpuUsage} readOnly />
                                                        <label>Cpu %</label>
                                                    </span>
                                                </div>

                                                <div className="ui-g-12 ui-md-12">
                                                    <span className="md-inputfield">
                                                        <InputText value={info.MemoryUsage} readOnly />
                                                        <label>Memory %</label>
                                                    </span>
                                                </div>

                                                <div className="ui-g-12 ui-md-12">
                                                    <span className="md-inputfield">
                                                        <InputText value={info.DiskUsage} readOnly />
                                                        <label>HDD %</label>
                                                    </span>
                                                </div>


                                                <div className="ui-g-12 ui-md-9">
                                                    <span className="md-inputfield">
                                                        <InputText value={info.ActiveUserCount} readOnly />
                                                        <label>Connected User Number</label>
                                                    </span>
                                                </div>
                                                <div className="ui-g-12 ui-md-3">
                                                    <Button type="button" icon="iu-icon-face" iconPos="left" label="Show" onClick={this.showActiveUser} />
                                                </div>
                                                <div className="ui-g-12 ui-md-12">
                                                    <span className="md-inputfield">
                                                        <InputText value={info.OsVersion} readOnly />
                                                        <label>OS Version</label>
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="ui-grid-col-6">
                                <div className="ui-grid-row">
                                    <div className="ui-grid-col-6">
                                        <Panel header="Memory Usage">
                                            {cmRam && <Chart type="pie" data={cmRam} />}
                                        </Panel>
                                    </div>

                                    <div className="ui-grid-col-6">
                                        <Panel header="Disk Usage">
                                            {cmHdd && <Chart type="pie" data={cmHdd} />}
                                        </Panel>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

                <Dialog onHide={() => this.setState({ connectedUserVisible: false, connectedUserList: null })}
                    visible={connectedUserVisible} header="Role Details" resizable={false} modal={true} closeOnEscape={true}
                    width="750px" height="450px" >
                    {connectedUserList &&
                        <DataTable header="Connected User List" value={connectedUserList} rows={10} paginator={true} pageLinkSize={10} rowsPerPageOptions={[5, 10, 20, 50, 100]} responsive={true} >
                            <Column body={this.rowNumTemplate} style={{ textAlign: 'center', width: '5%' }} />

                            <Column field="Username" header="User Name" sortable={true} filter={true} filterMatchMode="contains" />
                            <Column field="RoleName" header="Role" sortable={true} filter={true} filterMatchMode="contains" />
                            <Column field="LoginCount" header="Login Count" sortable={true} filter={true} filterMatchMode="contains" />
                        </DataTable>}
                </Dialog>
            </React.Fragment>
        )
    }
}