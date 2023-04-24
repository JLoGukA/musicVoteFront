//import React from 'react'
import axios from 'axios'
import { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import box from "../Elements"
import Cookies from 'universal-cookie';

import '../css/App.css';

const cookies = new Cookies();
const ThemeContext = createContext(box.updateThemeList())

function CookiesPrompt(){
  const theme = useContext(ThemeContext)

  const navigate=useNavigate()
  return(
      <div className={"pollCookies " +theme[3]}>
          <h1 class="pollHeader">Этот сайт использует Cookies. Разрешить их создание и хранение?</h1>
          
          <div className="pollCookiesRow">
              <box.Button theme={theme[2]} link="https://mf.bmstu.ru/" text="Нет" style={String("itext")}/>
              <div className='spaceElement'></div>
              <box.Button theme={theme[2]} text="Да" style={String("itext")} onclick={()=>{cookies.set("CookiesAllowed",1);navigate("/")}}/>
          </div>
      </div>
  )
}

// function NavBarVert(props){
//   const theme = useContext(ThemeContext)
//   return(
//           <div className={"navbar-vertical " + props.theme}>
//                   {<box.Button theme={theme[2]} link="https://mf.bmstu.ru/" text="МФ МГТУ" style={String("ibmstu")}/>}
//                   {<box.Button theme={theme[2]} link="http://rasp.msfu.ru/" text="Расписание" style={String("ischedule")}/>} 
//                   {<box.Button theme={theme[2]} style={String("igear")}/>}
//                   {<box.Button theme={theme[2]} link="http://rasp.msfu.ru/" text="Предложить музыку" style={String("inote")}/>}
//           </div>   
//   ) 
// }

function NavBar(props){
  const theme = useContext(ThemeContext)

  
  
  return(
        <div className={"navbar " + theme[1]}>
            <div className="navbarchild">
                {<box.Button theme={theme[2]} link="https://mf.bmstu.ru/" text="МФ МГТУ" style={String("ibmstu")}/>}
                {<box.Button theme={theme[2]} link="http://rasp.msfu.ru/" text="Расписание" style={String("ischedule")} onclick={()=>{test()}}/>} 
            </div>
            
            <div className="navbarchild">
                {<box.Button theme={theme[2]} style={String("igear")}/>}
                {<box.Button theme={theme[2]} link="http://rasp.msfu.ru/" text="Предложить музыку" style={String("inote")}/>}
            </div>
            
        </div>   
  ) 
}

function Poll(props){
  /* 
  All songs names(array) = musicData[0], 
  Votes for every song(array) = musicData[1] 
  Amount of songs = musicData[2], 
  Amount of all votes = musicData[3] */
  const theme = useContext(ThemeContext)
  
  const [active, setActive]=useState(false)
  const [voted, setVoted]=useState(-1)

  const elements=[]

  for(let i=0;i<props.musicData[2];i++){

      let y = parseInt(props.musicData[1][i],10)

      if(!active){
          elements[i]=(
                      <div className={'pollElem '+theme[5]} onClick={() => {update(i,y)}}>
                          <h2>{props.musicData[0][i]}</h2>
                      </div>
                      )
      }
      else{
          elements[i]=(<div className="elemCont">
                          <h2>{props.musicData[0][i] + " - "+(y / props.musicData[3] * 100).toFixed(2) + "%"}</h2>
                          <div className={(voted===i) ? 'pollElem' : 'pollElem'}>
                              <div className={(y!==0) ? "progress-bar "+theme[4]:""} style={
                                  { 'width': ((y / props.musicData[3] * 100).toFixed(2)) + "%"}}>
                              </div>
                          </div>
                      </div>
                      )
      }
  }

  const update =async (num,amount) =>{
      if(cookies.get("VoteAccepted")){
          alert("Вы уже проголосовали за "+cookies.get("VoteAccepted")+"!")
          return;
      }
      props.updateRequest(num,amount+1)
      cookies.set("VoteAccepted",props.musicData[0][num])
      setVoted(num)
      setActive(true)
  }
  return(
      <div className={"poll "+theme[3]}>
          <h1>Какая музыка будет играть на следующем перерыве?</h1>
          {elements}
      </div>
  )
}


function AppDesktop(){

  const navigate = useNavigate();
  const [musicData,setMusic]=useState([])
  const [update,doUpdate]=useState(0)
  const [theme,setTheme]=useState({})

  
  document.body.style="transition:all;height: 100%; 0.2s; background:"+theme[0]+";"

  useEffect(() => {
    handleUpdateRequests(-1,-1)
    doUpdate(Math.random())
  },[])

  useEffect(()=>{
    setTheme(box.updateThemeList())
  },[update])

  const handleUpdateRequests =async (num,h)=>{
    let res
    if(num!==-1)res = await axios.post(box.serverIP+"/set/votes",{num,h})
    else res = await axios.get(box.serverIP+"/get/music")
    setMusic(res.data)
  }

  let elem,navbar
  
  if(cookies.get("CookiesAllowed")){
    navbar = <ThemeContext.Provider value={theme}><NavBar /></ThemeContext.Provider>
    // navbar2 = <NavBarVert />
    elem =<ThemeContext.Provider value={theme}>
            <Poll musicData={musicData} updateRequest={handleUpdateRequests} />
          </ThemeContext.Provider>
  }
  else elem = <ThemeContext.Provider value={theme}>
                
                <CookiesPrompt/>
              </ThemeContext.Provider>
  return (
      <div className="mainLevel">
        <div className='topLevel'>
          {<box.Button style={String("ispace")} theme={theme[2]}/>}
          {<box.Menu emplace={1} update={doUpdate}/>}
          {<box.Button style={String("ilightDark")} theme={theme[2]} onclick={()=>{box.lightMode();doUpdate(Math.random())}}/>}
          {<box.Button style={String("iterminal")} theme={theme[2]} onclick={()=>{navigate("/login");}} />}
        </div>
        {navbar}
        
        <div className='spaceElement'></div>
        {elem}
      </div>
  )
}

export default AppDesktop;

  