import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { IStoreState } from '../../../store/IStoreState'
import { LayoutAction, layoutActions } from '../../../actions/layout.actions';
import { ScrollPanel } from 'primereact/components/scrollpanel/ScrollPanel';


interface AppRightpanelProps {
    rightPanelActive?: boolean;

    onRightPanelClick?: () => LayoutAction;
}
function mapStateToProps(state: IStoreState): AppRightpanelProps {
    let ret: AppRightpanelProps = {};
    ret.rightPanelActive = state.layoutReducer.rightPanelActive;
    return ret;
}
function mapDispatchToProps(dispatch: Dispatch<IStoreState>): AppRightpanelProps {
    const actions: AppRightpanelProps = {
        onRightPanelClick: () => dispatch(layoutActions.onRightPanelClick())
    };
    return actions;
}


interface AppRightpanelState {

}

class AppRightpanelComponent extends React.Component<AppRightpanelProps, AppRightpanelState> {
    constructor(props: AppRightpanelProps) {
        super(props);

        this.state = {};
    }

    onRightPanelClick = (e) => {
        this.props.onRightPanelClick();
    };


    render() {
        const { rightPanelActive } = this.props;
        return (

            <div className={"layout-rightpanel" + (rightPanelActive ? " layout-rightpanel-active" : "")} onClick={this.onRightPanelClick}>
                <ScrollPanel style={{ height: "100%" }}>
                    <div className="layout-rightpanel-wrapper">
                        <div className="layout-rightpanel-header">
                            <div className="weather-day">Wednesday</div>
                            <div className="weather-date">Jan 26</div>
                        </div>

                        <div className="layout-rightpanel-content">
                            <h1>Weather</h1>
                            <h2>San Francisco, USA</h2>

                            <div className="weather-today">
                                <span className="weather-today-value">21&#8451;</span>
                                <img src="assets/layout/images/dashboard/weather-icon-2.svg" width="60" />
                            </div>

                            <ul className="weekly-weather">
                                <li>
                                    Thursday
                            <img src="assets/layout/images/dashboard/weather-icon-1.svg" />
                                    <span className="weekly-weather-value">24</span>
                                </li>
                                <li>
                                    Friday
                            <img src="assets/layout/images/dashboard/weather-icon-3.svg" />
                                    <span className="weekly-weather-value">19</span>
                                </li>
                                <li>
                                    Saturday
                            <img src="assets/layout/images/dashboard/weather-icon-4.svg" />
                                    <span className="weekly-weather-value">15</span>
                                </li>
                                <li>
                                    Sunday
                            <img src="assets/layout/images/dashboard/weather-icon-1.svg" />
                                    <span className="weekly-weather-value">24</span>
                                </li>
                                <li>
                                    Monday
                            <img src="assets/layout/images/dashboard/weather-icon-2.svg" />
                                    <span className="weekly-weather-value">21</span>
                                </li>
                                <li>
                                    Tuesday
                            <img src="assets/layout/images/dashboard/weather-icon-3.svg" />
                                    <span className="weekly-weather-value">20</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </ScrollPanel>

            </div>
        );
    }
}

const connectedAppRightpanelComponent: any = connect(mapStateToProps, mapDispatchToProps)(AppRightpanelComponent);
export { connectedAppRightpanelComponent as AppRightpanelComponent }; 
