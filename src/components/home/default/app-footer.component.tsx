import * as React from 'react';
import {  Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { IStoreState } from '../../../store/IStoreState'


interface AppFooterProps {

}
function mapStateToProps(state: IStoreState): AppFooterProps {
    let ret: AppFooterProps = {};
    return ret;
}
function mapDispatchToProps(dispatch: Dispatch<IStoreState>): AppFooterProps {
    const actions: AppFooterProps = {
    };
    return actions;
}


interface AppFooterState {

}

class AppFooterComponent extends React.Component<AppFooterProps, AppFooterState> {
    constructor(props: AppFooterProps) {
        super(props);

        this.state = {};

        //this.onRightPanelButtonClick = this.onRightPanelButtonClick.bind(this);
    }



    render() {
        return (
            <div className="footer">
            <div className="card clearfix">
                <span className="footer-text-left">Prime ULTIMA for React</span>
                <span className="footer-text-right">
                    <span className="material-icons ui-icon-copyright"></span>
                    <span>All Rights Reserved</span>
                </span>
            </div>
        </div>
        );
    }
}

const connectedAppFooterComponent: any = connect(mapStateToProps, mapDispatchToProps)(AppFooterComponent);
export { connectedAppFooterComponent as AppFooterComponent }; 
