import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import './styles/core.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './app/index';
import store from './store'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
       <BrowserRouter>
          <App/>
       </BrowserRouter>
    </Provider>
);
