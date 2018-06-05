import * as React from 'react';
import { DropdownProps, Dropdown } from 'primereact/components/dropdown/Dropdown';

import { Toolbox } from '../../utils/toolbox';
import { WidgetComponent, WidgetProps, ErrorTooltip, createErrorStyle, WidgetState } from './widget.component';
import { ValidationContext } from './formx';


class DropdownXComponent extends WidgetComponent<WidgetProps&DropdownProps, WidgetState> {
    constructor(props) {
        super(props);
    }

    getValueFrom(e) {
        return e.value;
    };

    render() {
        const { options, style, ...restTyped } = this.props;
        const { errorMessage } = this.state;
        const isValid = Toolbox.isUndefinedOrNull(errorMessage);
        const value = this.getValue();
        const elementId = this.getId();
        const rest: any = restTyped;

        return (
            <React.Fragment>
                <Dropdown id={elementId} value={value} options={options} onChange={this.onChange} 
                    style={createErrorStyle(isValid, style)} {...rest} />
                {!isValid && <ErrorTooltip id={elementId} errorMessage={errorMessage} />}
            </React.Fragment>

        )
    }
} 

export const DropdownX = (props:WidgetProps&DropdownProps) => {
    const rest: any = props;
    return (
    <ValidationContext.Consumer>
    {
        ({ model, onModelChanged, validators, onValidationChanged }) => <DropdownXComponent model={model} onModelChanged={onModelChanged} validators={validators} onValidationChanged={onValidationChanged} {...rest}/>
    }
    </ValidationContext.Consumer>
)};