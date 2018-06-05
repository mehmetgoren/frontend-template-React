import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import {store} from './store/configureStore' 


import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { App } from './App';


const app = (
  <Provider store={store}>
      <App />
  </Provider>
);

//console.warn = () => {};
//console.error = () => {};
//window.alert = (value) => { console.log(value) };

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();