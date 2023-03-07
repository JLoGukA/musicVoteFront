import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react';

import './css/App.css';

import box from "./WelcomeScreen"

import Cookies from 'universal-cookie';

const cookies = new Cookies();

function setCookiesAllow(props){
  if(props===1){
    cookies.set("CookiesAllowed",1);
    if(cookies.get("themeColor")===undefined||cookies.get("themeLight")===undefined){
      cookies.set("themeColor",2);
      cookies.set("themeLight",0);
    }
  }
  else cookies.remove("CookiesAllowed")
}

function AppDesktop(){

  const [musicData,setMusic]=useState([])
  const [admin, setAdmin]=useState(0)
  const [update,doUpdate]=useState(0)

  const makeUpdate=(props)=>{
    if(props!=-1)document.body.className = props;
    doUpdate(props)
  }
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

  let elem
  if(cookies.get("CookiesAllowed")){
    elem = <box.Poll mobile={0} musicData={musicData} updateRequest={handleUpdateRequests} />
  }
  else elem = <box.cookiesPrompt allowCookies={setCookiesAllow} makeUpdate={makeUpdate}/>
  return (
    <div className="mainLevel">
      <div className='topLevel'>
      {<box.Button style={String("ispace")}/>}
      {<box.themePoll update={makeUpdate}/>}
       
      </div>
      {<box.NavBar mobile={0} />}
      <div className='spaceElement'></div>
      {elem}
    </div>
  )

}

export default AppDesktop;

  