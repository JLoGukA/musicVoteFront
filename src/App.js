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

/* 
    All songs names(array) = musicData[0], 
    Votes for every song(array) = musicData[1] 
    Amount of songs = musicData[2], 
    Amount of all votes = musicData[3] 
*/
function AppDesktop(){
  const [musicData,setMusic]=useState([])
  const [login, setLogin]=useState(0)
  const [admin, setAdmin]=useState(0)
  const [update,doUpdate]=useState(0)

  useEffect(() => {
    handleUpdateRequests(-1,-1)
    makeUpdate()
  },[])

  

  const makeUpdate=()=>{
    var v =box.updateThemeList()
    if(v!==-1)document.body.className = v;
    doUpdate(Math.random())
  }
  const lightMode=()=>{
    var t = cookies.get("themeLight")

    if(t!==undefined){
      if(t==="0")cookies.set("themeLight",1)
      else cookies.set("themeLight",0)
      makeUpdate();
    }
  }

  const handleUpdateRequests =async (num,h)=>{
    let res
    if(num!==-1)res = await axios.post('http://localhost:3005/set/votes',{num,h})
    else res = await axios.get("http://localhost:3005/get/music")
    setMusic(res.data)
  }

  let elem,navbar
  
  if(cookies.get("CookiesAllowed")){
    if(admin||cookies.get("admin")){
      navbar = <box.NavBarAdmin mobile={0} update={makeUpdate} setAdmin={setAdmin} />
      elem=<box.AllDevices update={makeUpdate}/>
    }
    else{
      if(login){
        elem = <box.LogInBox setLogin={setLogin} setAdmin={setAdmin} update={makeUpdate}/>
      }
      else {
        navbar = <box.NavBar mobile={0} />
        elem = <box.Poll mobile={0} musicData={musicData} updateRequest={handleUpdateRequests} />
      }
    }
  }
  else elem = <box.CookiesPrompt allowCookies={setCookiesAllow} makeUpdate={makeUpdate}/>
  return (
    <div className="mainLevel">
      <div className='topLevel'>
        {<box.Button style={String("ispace")}/>}
        {<box.Menu emplace={1} update={makeUpdate}/>}
        {<box.Button style="ilightDark" onclick={()=>{lightMode()}}/>}
        {<box.Button style="iterminal" onclick={()=>{setLogin(!login);makeUpdate()}} />}
      </div>
      {navbar}
      <div className='spaceElement'></div>
      {elem}
    </div>
  )

}

export default AppDesktop;

  