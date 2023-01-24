import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react';

import './css/App.css';

import box from "./WelcomeScreen"

import Cookies from 'universal-cookie';

const cookies = new Cookies();
var cookiesAllowed=0;

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

function setCookiesAllow(props){
  if(props===1){
    cookies.set("CookiesAllowed",1);
  }
  else cookies.remove("CookiesAllowed")
}

function App(){

  var m=detectMob();

  const [musicData,setMusic]=useState([])
  

  useEffect(() => {
    handleUpdateRequests(-1,-1)
    
  },[])

  const handleUpdateRequests =async (num,h)=>{
    let res
    if(num!==-1)res = await axios.post('http://localhost:3005/set/votes',{num,h})
    else res = await axios.get("http://localhost:3005/get/music")
    setMusic(res.data)
  }

  if(cookies.get("CookiesAllowed"))cookiesAllowed=1;

  return (
    <div className="mainLevel">
      {<box.NavBar mobile={m} />}
      <div className='spaceElement'></div>
      {<box.ElemCont songsAmount={musicData[2]} mobile={m} music={musicData[0]} votes={musicData[1]} votesAmount={musicData[3]} updateRequest={handleUpdateRequests} allowCookies={setCookiesAllow} cookiesAllow={cookiesAllowed} />}
      
    </div>
  );
}

export default App;

  