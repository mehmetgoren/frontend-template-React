import * as React from 'react';
import { InputTextarea } from 'primereact/components/inputtextarea/InputTextarea';
import { ComponentBase } from '../../component-base';
import { SelectItem } from '../../../models/entities';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { Button } from 'primereact/components/button/Button';
import { Toolbox } from '../../../utils/toolbox';
import { UtilsService } from '../../../services/utils.service';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';

interface QueryLogProps { }
interface QueryLogState {
    query?: string;
    preDefinedQueryList?: SelectItem[];
    queryFields?: any[];
    queryList?: any[];
}

export class QueryLogComponent extends ComponentBase<QueryLogProps, QueryLogState> {

    utilsService: UtilsService;
    constructor(props) {
        super(props);

        const preDefinedQueryList = [];
        preDefinedQueryList.push({ value: null, label: "Please select a predefined query" });
        preDefinedQueryList.push({ value: "select * from Log t where t.Code=313 order by t.Id desc", label: "Login" });
        preDefinedQueryList.push({ value: "select t.Method, count(*) from Log t where t.Code=1010 group by t.Method", label: "WebSocket Connection Numbers" });

        this.state = { query: "", preDefinedQueryList: preDefinedQueryList, queryFields: [], queryList: null };

        this.utilsService = new UtilsService();
    }

    onChangePredefined = (e) => {
        const query = (e.value ? e.value : "");
        this.setState({ query: query });
    };

    onTextChanged = (e) =>{
        this.setState({query:e.target.value});
    };

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onExecuteQuery(null);
        }
    };

    onExecuteQuery = (e) => {
        const { query, queryFields } = this.state;
        if (query) {
            queryFields.length = 0;
            this.utilsService.queryLog(query)
                .then(data => {
                    if (data && data.length) {
                        for (var field in data[0]) {
                            queryFields.push(field);
                        }
                    }
                    this.setState({ queryList: data });
                });
        } else {
            Toolbox.showError("Please write a query");
        }
    };

    render() {

        const header = <div className="ui-grid-row">
            <div className="ui-grid-col-12">
                <label>SQLog Query Results</label>
            </div>
        </div>;

        const { preDefinedQueryList, query, queryFields, queryList } = this.state;

        const dynamicColumns = queryFields.map((field, i) => {
            return <Column key={field} field={field} header={field} filter={true} sortable={true} filterMatchMode={"contains"} />
        });

        return (
            <React.Fragment>
                <h3 className="captionH3" ><span className="captionSpan" style={{ "color": "#365073", "margin": "15px", "fontSize": "24px" }}>SQLog Studio. (it just queries a single sqlite file, not the application rdbms)</span></h3>


                <div className="ui-fluid" onKeyPress={this.onKeyPress} >
                    <div className="ui-g">
                        <div className="ui-g-12">
                            <div className="card card-w-title">
                                <div className="ui-g form-group">

                                    <div className="ui-g-12 ui-md-12">
                                        <Dropdown value={query} options={preDefinedQueryList} onChange={this.onChangePredefined}
                                            style={{ width: '100%' }} placeholder="Select a predefined query" />
                                    </div>

                                    <div className="ui-g-12 ui-md-12">
                                        <InputTextarea value={query} onChange={this.onTextChanged} rows={3} cols={30} placeholder="Write a query here" />
                                    </div>


                                    <div className="ui-g ui-md-3">
                                        <Button type="button" icon="ui-icon-search" label="Execute" onClick={this.onExecuteQuery}/>
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

                            <DataTable value={queryList} selectionMode="single" header={header}
                                rows={50} paginator={true}>
                                {dynamicColumns}
                            </DataTable>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}