import React from 'react';
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import App from './ui/App';
import reportWebVitals from './reportWebVitals';
import Backchannel, { EVENTS } from './backend';

declare global {
  interface Window {
    spake2: any;
  }
}

let backchannel = Backchannel()

backchannel.once(EVENTS.OPEN, async () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
