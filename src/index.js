import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import store from './store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode className="index__strict-mode">
    <Provider store={store} className="index__provider">
      <App />
    </Provider>
  </React.StrictMode>
);
