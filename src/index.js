import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import AppDesktop from './App';
import AppMobile from './AppMobile'

function detectMob() {
  const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
  ];
  
  return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
if(detectMob()){
  root.render(
    <React.StrictMode>
      <AppMobile />
    </React.StrictMode>
  );
}
else{
  root.render(
    <React.StrictMode>
      <AppDesktop />
    </React.StrictMode>
  );
}

