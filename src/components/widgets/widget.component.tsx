import * as React from 'react';

import { Toolbox } from '../../utils/toolbox';
import { Tooltip } from 'primereact/components/tooltip/Tooltip';
import { ValidatorFn } from '../../utils/validation/validators';
import { FormContextProps } from './formx';
import { validateField } from '../../utils/validation/validation';


export interface WidgetProps {
    id?:string;
    model?: any;
    field: string;
    onModelChanged?(model): void;
}

export interface WidgetState{
    errorMessage?:string;
}

export abstract class WidgetComponent<TProps extends WidgetProps&FormContextProps, TState extends WidgetState> extends React.Component<TProps, TState>{
    constructor(props: TProps) {
        super(props);

        this.createState = this.createState.bind(this);
        this.getValueFrom = this.getValueFrom.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getValue = this.getValue.bind(this);
        this.getErrorMessage = this.getErrorMessage.bind(this);
        this.getId = this.getId.bind(this);

        this.state = this.createState();
    }

    componentWillMount(){//bunu ekleme sebebim eğer mevcut model,n ilgili field' i invalid ise style değişsin.
        this.setState({errorMessage:this.getErrorMessage()});
    }


    //virtual
    createState(): TState {
        const ret:any = {errorMessage:null};
        return ret;
    }


    abstract getValueFrom(e):any;

    onChange(e){
        const { model, field, onModelChanged } = this.props;
        model[field] = this.getValueFrom(e);

        if (onModelChanged) {
            onModelChanged(model);
        }

        this.setState({errorMessage:this.getErrorMessage()});
    }

    getValue():any{
        const { model, field } = this.props;
        const value = model[field];
        return value
    }; 

    private getErrorMessage(): string {
        const { validators, field, onValidationChanged } = this.props;
        return validateField(validators, field, this.getValue(), onValidationChanged);
    };

    getId(): string {
        const { validators, id } = this.props;
        if (id)
            return id;
        else if (validators){
            return  ("el_"+Toolbox.guid());
        }
        else
             return undefined;
       // const { id } = this.props;
        //const elementId = (id ? id : ("el_"+Toolbox.guid()));
      //  return elementId;
    };
}

const invalidStyle = {
    'borderColor': '#ec5840'
}

export function createErrorStyle(isValid, style){
    return isValid ? style : (style ? Object.assign(style, invalidStyle) : invalidStyle);
}

export const ErrorTooltip = (props:{id, errorMessage}) =>(
    <Tooltip for={"#"+props.id} title={props.errorMessage} tooltipPosition="top"  />
);