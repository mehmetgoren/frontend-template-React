import * as React from 'react';
import { InputTextProps, InputText } from 'primereact/components/inputtext/InputText';
import { Toolbox } from '../../utils/toolbox';
import { WidgetProps, WidgetComponent, createErrorStyle, ErrorTooltip, WidgetState } from './widget.component';
import { ValidationContext } from './formx';


class InputXComponent extends WidgetComponent<WidgetProps&InputTextProps, WidgetState> {
    constructor(props) {
        super(props);
    }

    getValueFrom(e){
        return e.target.value;
    }

    render() {
        const { style, ...restTyped } = this.props;
        const { errorMessage } = this.state;
        const isValid = Toolbox.isUndefinedOrNull(errorMessage);
        const value = this.getValue();
        const elementId = this.getId();
        const rest: any = restTyped;
        
        return (
            <React.Fragment>
                <InputText id={elementId} value={value} onChange={this.onChange}
                    style={createErrorStyle(isValid, style)} {...rest} />
                {!isValid && <ErrorTooltip id={elementId} errorMessage={errorMessage} />}
            </React.Fragment>
        )
    }
}

export const InputX = (props:WidgetProps&InputTextProps) => {
    const rest: any = props;
    return (
    <ValidationContext.Consumer>
    {
        ({ model, onModelChanged, validators, onValidationChanged }) => <InputXComponent model={model} onModelChanged={onModelChanged} validators={validators} onValidationChanged={onValidationChanged} {...rest}/>
    }
    </ValidationContext.Consumer>
)};