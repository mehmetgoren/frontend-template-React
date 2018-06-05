import 'primereact/resources/primereact.min.css';

import * as React from 'react';
import {IStoreState} from './store/IStoreState';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LoginComponent } from './components/home/login/login.component';
import { DefaultComponent } from './components/home/default/default.component';
import { Toolbox } from './utils/toolbox';
import { AppStorage } from './utils/app-storage';
import { metadataActions } from './actions/metadata.actions';

interface AppProps {
    isAuthenticated?: boolean;
    isMetadataLoaded?:boolean;
    pullMetadata?:() =>(dispatch: Dispatch<IStoreState>) => void;
}
function mapStateToProps(state: IStoreState) {
    let ret: any = {};
    ret.isAuthenticated = !Toolbox.isUndefinedOrNull(state.loginReducer.userLocal); 
    ret.isMetadataLoaded = !Toolbox.isUndefinedOrNull(state.metadataReducer.metadata)
    //alert(JSON.stringify(ret));
    return ret;
}

function mapDispatchToProps(dispatch: Dispatch<IStoreState>) {
    return {
        pullMetadata:bindActionCreators(metadataActions.pullMetadata, dispatch)
    };
}


interface AppState {

}

class App extends React.Component<AppProps, AppState> {


    componentWillMount(){
        const user = AppStorage.getUser();
        if (user) {
            this.props.pullMetadata();
        }
    }
    
    render() {
         const { isAuthenticated, isMetadataLoaded } = this.props;
         return (!isAuthenticated ? <LoginComponent/> :( !isMetadataLoaded ? <Loading/> : <DefaultComponent/>) )
    }
}


const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);
export { connectedApp as App }; 

const Loading = () => {
    return (
        <div className="BlueBack" style={{ "height": "100%", "textAlign": "center" }}>
            <div style={{ "paddingTop": "200px", "marginTop": "25px" }}>
                <div className="windows8">
                    <div className="wBall" id="wBall_1">
                        <div className="wInnerBall"></div>
                    </div>
                    <div className="wBall" id="wBall_2">
                        <div className="wInnerBall"></div>
                    </div>
                    <div className="wBall" id="wBall_3">
                        <div className="wInnerBall"></div>
                    </div>
                    <div className="wBall" id="wBall_4">
                        <div className="wInnerBall"></div>
                    </div>
                    <div className="wBall" id="wBall_5">
                        <div className="wInnerBall"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 