import * as React from 'react';
import { ValidatorDictionary, validateField } from '../../utils/validation/validation';
import { Toolbox } from '../../utils/toolbox';

type FormPropsPure = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export interface FormXProps extends FormPropsPure {
    model: any;
    onModelChanged?(model:any);
    validators: ValidatorDictionary;
}

export interface FormXState {
    context: FormContextProps;
    fieldValidDic: {[field:string] :boolean};
}

export class FormX extends React.Component<FormXProps, FormXState> {

    constructor(props: FormXProps) {
        super(props);

        this.onValidationChanged = this.onValidationChanged.bind(this);

        this.state = { context: { model:props.model, onModelChanged:props.onModelChanged, validators: props.validators, onValidationChanged: this.onValidationChanged, canSubmit:false }, fieldValidDic: {}};
    }

    componentWillMount(){ //bunu ekleme sebebim eğer mevcut model invalid ise button disabled olsun.
        const {model, validators} = this.props;
        if (model){
            for(const field in validators){
                validateField(validators, field, model[field], this.onValidationChanged);
            }
        }
    }

    onValidationChanged(field: string, isValid: boolean) {
         const currentState = Toolbox.copyShallow(this.state);
         const dic = currentState.fieldValidDic;
         dic[field] = isValid

         let canSubmit = true;
         for(const field in dic){
             canSubmit = canSubmit&&dic[field];
             if (!canSubmit)
                break;
         }
         currentState.context.canSubmit = canSubmit;

         this.setState(currentState);
    };

    render() {
        const { ...rest } = this.props;
        const { context } = this.state;

        return (

            <ValidationContext.Provider value={context} >
                <form {...rest}></form>
            </ValidationContext.Provider>
        )
    }
}


export interface FormContextProps {
    model?:any;
    onModelChanged?(model:any)
    validators?: ValidatorDictionary;
    onValidationChanged?(field: string, isValid: boolean) : void;
    canSubmit?:boolean;
}

export const ValidationContext = React.createContext<FormContextProps>({ model:null, onModelChanged:null, validators: null, onValidationChanged: null, canSubmit:true });
