import * as React from 'react';
import { Button, ButtonProps } from 'primereact/components/button/Button';
import { ValidationContext } from './formx';


export const ButtonX = (props: ButtonProps) => {//a stateless component.
    const rest: any = props;
    return(
        <ValidationContext.Consumer>
            {
                ({canSubmit}) => <Button disabled={!canSubmit}  {...rest} />
            }
        </ValidationContext.Consumer>
    )
};

// ({canSubmit}) => { alert(canSubmit); return(<Button disabled={!canSubmit}  {...rest} />); }