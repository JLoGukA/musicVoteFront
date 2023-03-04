import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

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
  const [adm, setAdm]=useState(0)
  /* 
    All songs names(array) = musicData[0], 
    Votes for every song(array) = musicData[1] 
    Amount of songs = musicData[2], 
    Amount of all votes = musicData[3] 
  */
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

  if(cookiesAllowed){

    return (
      <div className="mainLevel">
        {<box.Button style={String("ispace")} onClick={()=>{setAdm(1)}}/>} 
        {<box.NavBar mobile={m} />}
        <div className='spaceElement'></div>
        {<box.Poll mobile={m} musicData={musicData} updateRequest={handleUpdateRequests} />}
      </div>
    )
  }
  else{
    return (
      <div className="mainLevel">
        {<box.Button style={String("ispace")}/>} 
        {<box.NavBar mobile={m} />}
        <div className='spaceElement'></div>
        {<box.cookiesPrompt allowCookies={setCookiesAllow}/>}
        
      </div>
    );
  }
}

export default App;

  