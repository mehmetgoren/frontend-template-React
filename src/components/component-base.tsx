import * as React from 'react';
import { AppStorage } from '../utils/app-storage';
import { Toolbox } from '../utils/toolbox';


export class ComponentBase<TProps, TState> extends React.Component<TProps, TState> {

    constructor(props, private checkUser = true) {
        super(props);

        this.onSelectChange = this.onSelectChange.bind(this);
        this.onInputChange = this.onSelectChange.bind(this);
    }


    //it needs to set the element's name., have to bind via bindSelfFunctions

    onSelectChange(e, model, fieldName) {
        model[fieldName] = e.value;
        this.onStateNeedToBeSet(model);
    };

    onInputChange(e, model, fieldName) {
        model[fieldName] = e.target.value;
        this.onStateNeedToBeSet(model);
    };


    onStateNeedToBeSet = (model) => {

    }

    rowNumTemplate(rowData, column) {
        return <div style={{ "textAlign": "center" }}>{column.rowIndex + 1}</div>
    }


    componentWillMount() {
        if (this.checkUser) {
            const user = AppStorage.getUser();
            const isAuthenticated = !Toolbox.isUndefinedOrNull(user) && !Toolbox.isUndefinedOrNull(user.Token);
            if (!isAuthenticated) {
                AppStorage.logout();
            }
        }
    }


    private baseFunctionNamesHash = {
        render: true,
        forceUpdate: true,
        setState: true,
        componentWillMount: true,
        componentDidMount: true,
        componentWillReceiveProps: true,
        shouldComponentUpdate: true,
        componentWillUpdate: true,
        componentDidUpdate: true,
        componentWillUnmount: true,
        componentDidCatch: true,
        bindSelfFunctions: true
    }
    bindSelfFunctions(me) {
        let ret = [];
        const selfFunctions = Toolbox.getAllFunctionNames(me);
        for (let j = 0; j < selfFunctions.length; ++j) {
            let f = selfFunctions[j];
            if (!this.baseFunctionNamesHash[f]) {
                ret.push(f);
                f = me[f].bind(me);
            }
        }
    }
}