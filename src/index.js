import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import './css/index.css';
import AppDesktop from './App';
import LoginPage from './LoginPage';
import Devices from './AdminPage/Devices';
import Files from './AdminPage/Generation';
import Schedule from './AdminPage/Schedule';
import Vote from './AdminPage/Polls'

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
    element: <AppDesktop mobile={detectMob()}/>,
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
  },
  {
    path:'/voteSettings',
    element:<Vote/>
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
if(detectMob()){
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
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

