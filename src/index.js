import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import './css/index.css';
import AppMobile from './MainPageMobile/AppMobile';
import AppDesktop from './MainPage/App';
import LoginPage from './LoginPage/LoginPage';
import Devices from './AdminPage/Devices';
import Files from './AdminPage/Files';
import Schedule from './AdminPage/schedule';

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

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppDesktop/>,
  },
  {
    path:'/login',
    element:<LoginPage/>
  },
  {
    path:'/devices',
    element:<Devices/>
  },
  {
    path:'/files',
    element:<Files/>
  },
  {
    path:'/schedule',
    element:<Schedule/>
  }
]);


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
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

