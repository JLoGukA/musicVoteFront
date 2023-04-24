import React from 'react'
import { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import '../css/App.css';

import box from "../Elements"

const cookies = new Cookies();
const ThemeContext = createContext(box.updateThemeList())

function LogInBox(){
  const navigate=useNavigate()
  const theme = useContext(ThemeContext)

  const onKeyEnter=async(e)=>{
      if(e==="Enter"){
          const res = await fetch(box.serverIP+"/user/login", {
              method: "POST",
              headers: {"Content-Type": "application/JSON"},
              body: JSON.stringify({"login":document.getElementById("login").value,"pass":document.getElementById("pass").value})
          }).then((res) => res.json());

          if(res===1){
              cookies.set("admin",'1');
              navigate('/devices');
          }
          else alert("Неправильный логин или пароль")
      }
  }
  return(
      <div className="logInBox">
          <box.InputField theme={theme[6]} idx="login" text="Логин" display={true}/>
          <box.InputField theme={theme[6]} idx="pass" text="Пароль" onKey={onKeyEnter} type="password" display={true}/>
          <box.Button theme={theme[2]} style={String('itext')} text="Войти" onclick={()=>{onKeyEnter("Enter")}}/>
      </div>
  )
}

function LoginPage(){
  const navigate=useNavigate()

  if(cookies.get("CookiesAllowed")===undefined){
    navigate("/")
  }
  if(cookies.get("admin")){
    navigate("/devices")
  }
  
  const [update,doUpdate]=useState(0)
  const [theme,setTheme]=useState({})

  document.body.style="transition:all 0.2s; background:"+theme[0]+";"

  useEffect(() => {
    doUpdate(Math.random())
  },[])

  useEffect(()=>{
    setTheme(box.updateThemeList())
  },[update])

  let elem =<ThemeContext.Provider value={theme}>
              <LogInBox>
            </LogInBox></ThemeContext.Provider>
  
  return (
      <div className="mainLevel">
        <div className='topLevel'>
          {<box.Button style={String("ispace")}/>}
          {<box.Menu emplace={1} update={doUpdate}/>}
          {<box.Button theme={theme[2]} style={String("ilightDark")} onclick={()=>{box.lightMode();doUpdate(Math.random())}}/>}
          {<box.Button theme={theme[2]} style={String("iterminal")} onclick={()=>{navigate("/")}} />}
        </div>
        <div className='spaceElement'></div>
        {elem}
      </div>
  )
}

export default LoginPage;

  