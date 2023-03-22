import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import './css/index.css';
import AppMobile from './MainPageMobile/AppMobile';
import AppDesktop from './MainPage/App';
import LoginPage from './LoginPage/LoginPage';
import AdminPage from './AdminPage/AdminPage';
import Files from './AdminPage/Files';

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
    path:'/admin',
    element:<AdminPage/>
  },
  {
    path:'/files',
    element:<Files/>
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

