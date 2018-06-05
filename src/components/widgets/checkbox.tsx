import * as React from 'react';

import {Checkbox, CheckboxProps} from 'primereact/components/checkbox/Checkbox';

import { Toolbox } from '../../utils/toolbox';
import { WidgetComponent, WidgetProps, ErrorTooltip, createErrorStyle, WidgetState } from './widget.component';
import { ValidationContext } from './formx';


class CheckboXComponent extends WidgetComponent<WidgetProps&CheckboxProps, WidgetState> {
    constructor(props) {
        super(props);
    }


    getValueFrom(e) {
        return e.checked;
    };

    render() {
        const { style, ...restTyped } = this.props;
        const { errorMessage } = this.state;
        const isValid = Toolbox.isUndefinedOrNull(errorMessage);
        const value = this.getValue();
        const elementId = this.getId();
        const rest: any = restTyped;

        return (
            <React.Fragment>
                <Checkbox {...rest}  id={elementId} onChange={this.onChange} checked={value}
                    style={createErrorStyle(isValid, style)}/>
                {!isValid && <ErrorTooltip id={elementId} errorMessage={errorMessage} />}
            </React.Fragment>
        )
    }
} 

export const CheckboX = (props:WidgetProps&CheckboxProps) => {
    const rest: any = props;
    return (
    <ValidationContext.Consumer>
    {
        ({ model, onModelChanged, validators, onValidationChanged }) => <CheckboXComponent model={model} onModelChanged={onModelChanged} validators={validators} onValidationChanged={onValidationChanged} {...rest}/>
    }
    </ValidationContext.Consumer>
)};