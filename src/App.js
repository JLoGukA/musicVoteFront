//import React from 'react'
import axios from 'axios'
import { useState, useEffect, useContext, createContext,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import box from "./Elements"
import Cookies from 'universal-cookie';

import './css/App.css';

const cookies = new Cookies();
const ThemeContext = createContext(box.updateThemeList())
var theme

function CookiesPrompt(props){
  const navigate=useNavigate()

  const setTheme=()=>{
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if(prefersDark&&cookies.get("CookiesAllowed")){
        cookies.set("themeLight",0);
        cookies.set("themeColor",4);
    }
    else{
        cookies.set("themeLight",1);
        cookies.set("themeColor",4);
    }
    props.update()
  }

  return(
      <div className={"pollCookies " +theme[3]}>
          <h1 class="pollHeader">Этот сайт использует Cookies для идентификации, а также для кастомизации внешнего вида. Эти данные не передаются третьим лицам. Разрешить их создание и хранение?</h1>
          <div className="pollCookiesRow">
              <box.Button link="https://mf.bmstu.ru/" text="Нет" style={String("itext")}/>
              <div className='spaceElement'></div>
              <box.Button text="Да" style={String("itext")} onclick={()=>{cookies.set("CookiesAllowed",1);setTheme();navigate("/")}}/>
          </div>
      </div>
  )
}

function NavBarVertical(props){
  return(
        <div className={"navbar-vertical " + props.theme}>
          {<box.Button theme={theme[2]} link="https://mf.bmstu.ru/" text="МФ МГТУ" style={String("ibmstu")}/>}
          {<box.Button theme={theme[2]} link="http://rasp.msfu.ru/" text="Расписание" style={String("ischedule")}/>} 
          {<box.Button theme={theme[2]} style={String("igear")}/>}
          {<box.Button theme={theme[2]} link="http://rasp.msfu.ru/" text="Предложить музыку" style={String("inote")}/>}
        </div>   
  ) 
}

function NavBar(props){

  return(
    props.mobile ? 
      <div>
          <div className={"navbar_mobile "+theme[1]}>
            
              {<box.Button link="https://mf.bmstu.ru/" style={String("ibmstuM")} text="МФ МГТУ" mobile={true}/>}
              {<box.Button link="http://rasp.msfu.ru/" style={String("ischeduleM")} text="Расписание" mobile={true}/>}
              {<box.Button link="https://eventcontroller.ru/index" style={String("itvM")} text="События" mobile={true}/>}
              {<box.Button link="http://rasp.msfu.ru/" style={String("inoteM")} text="Музыка" mobile={true}/>}
              {<box.Button style={String("ilightDark")} onclick={()=>{box.lightMode();props.update()}} text="Тема" mobile={true}/>}
          </div>  
      </div> 
    :
        <div className={"navbar " + theme[1]}>
            <div className="navbarchild">
                {<box.Button link="https://mf.bmstu.ru/" text="МФ МГТУ" style={String("ibmstu")}/>}
                {<box.Button link="http://rasp.msfu.ru/" text="Расписание" style={String("ischedule")}/>} 
                {<box.Button link="https://eventcontroller.ru/index" text="События" style={String("itv")}/>}
            </div>
            
            <div className="navbarchild">
                {<box.Button style={String("igear")} onclick={()=>{}}/>}
                {<box.Button link="http://rasp.msfu.ru/" text="Предложить музыку" style={String("inote")}/>}
            </div>
            
        </div>   
  ) 
}

function Poll(props){
  const [active,setActive]=useState(1)
  const [datebegin,setDateBegin]=useState(new Date(props.datebegin.slice(0,16)))
  const id = useRef(props.id)
  const votes = useRef([])
  const allVotes = useRef(parseInt(props.allVotes))
  const buttons = useRef([])
  const dateend = useRef(new Date(props.dateend.slice(0,16)))
  const [ui,updateUI]=useState(0)

  useEffect(()=>{
    buttons.current = createButtons()
  },[])
  useEffect(()=>{
    buttons.current = createButtons()
  },[active])

  const createButtons=()=>{
    let buttons=[]
    for(let i=0;i<props.buttonArray.length;i++){
      votes.current.push(props.buttonArray[i][1])
    }
    for(let i=0; i<props.buttonArray.length;i++){
      buttons.push(
        active==1 ?
        <div className={'pollElem '+theme[5]} onClick={() => {votes.current[i]++;allVotes.current++;updateVotes(props.buttonArray[i][0])}}>
          <h2>{props.buttonArray[i][0]}</h2>
        </div>
        :
        <div className="elemCont">
          <h2>{props.buttonArray[i][0] + " - "+(parseInt(votes.current[i]) / allVotes.current).toFixed(2)*100+ "%"}</h2>
          <div className={'pollElem '}>
              <div className={allVotes.current!=0 ? "progress-bar "+theme[4]:""} style={
                  { 'width': (parseInt(votes.current[i]) / allVotes.current).toFixed(2)* 100 + "%"}}>
              </div>
          </div>
        </div>
      )
    }
    return buttons
  }

  const updateVotes=async(row)=>{

    let cook=cookies.get("Poll"+id.current)
    let ended = dateend.current<=new Date() ? 1:0
    if(cook&&!ended){
      alert("Вы уже проголосовали за "+cook+"!")
    }
    else if(ended){
    }
    else {
      cookies.set("Poll"+id.current,row,{expires:dateend.current})
      await axios.get(box.serverIP+"/votes/inc",{headers:{"row":encodeURI(row),"id":id.current}})
      await props.getData()
      setActive(0)
    }
  }

  return(
    datebegin<new Date() ?
    <div className={"poll "+theme[3]}>
      <h1>{props.name}</h1>
      {buttons.current}
      <h3><box.Button style={String('iclock')}/>{dateend.current>new Date() ? "До "+dateend.current.toTimeString().slice(0,8) +" "+dateend.current.toDateString():"Голосование окончено"}</h3>
    </div>:<></>
  )
}

function PollTable(props){

  const [pollsData,setPollsData]=useState([])

  useEffect(()=>{
    getData()
  },[])

  const getData=async()=>{
    axios.get(box.serverIP+"/polls/info",{headers:{"poll":'1'}}).then((res)=>{
      
      let buttonArr={},pollArr=[],nameArr=[]
      let iter1,iter2
      for(let i=0; i<res.data.rows.length;i++){
        iter2=res.data.rows[i].poll_id
        if(iter1===iter2){
          buttonArr[iter2].push([
            res.data.rows[i].row_name,
            res.data.rows[i].votes,
          ])
        }
        else{
          iter1=iter2
          nameArr.push([
            res.data.rows[i].poll_name,
            res.data.rows[i].date_begin,
            res.data.rows[i].date_end
          ])
          buttonArr[iter2]=[]
          buttonArr[iter2].push([
            res.data.rows[i].row_name,
            res.data.rows[i].votes,
          ])
        }
      } 
      let i=0
      
      for(let j=0; j<Math.floor(res.data.rowsFile.length/2);j++,i+=2){
        pollArr.push(
          <tr>
          <td><Poll 
            id={res.data.rowsFile[i].poll_id} 
            name={nameArr[i][0]}
            datebegin={nameArr[i][1]}
            dateend={nameArr[i][2]}
            allVotes={res.data.rowsFile[i].votes}
            buttonArray={buttonArr[res.data.rowsFile[i].poll_id]}
            getData={()=>{getData()}}
          /></td>
          <td><Poll 
            id={res.data.rowsFile[i+1].poll_id} 
            name={nameArr[i+1][0]}
            datebegin={nameArr[i+1][1]}
            dateend={nameArr[i+1][2]}
            allVotes={res.data.rowsFile[i+1].votes}
            buttonArray={buttonArr[res.data.rowsFile[i+1].poll_id]}
            getData={()=>{getData()}}
          /></td>
          </tr>
        )
      }
      
      if(i<res.data.rowsFile.length&&res.data.rowsFile.length%2!==0){
        pollArr.push(
          <tr>
          <td><Poll 
            id={res.data.rowsFile[i].poll_id} 
            name={nameArr[i][0]}
            datebegin={nameArr[i][1]}
            dateend={nameArr[i][2]}
            allVotes={res.data.rowsFile[i].votes}
            buttonArray={buttonArr[res.data.rowsFile[i].poll_id]}
            getData={()=>{getData()}}
          /></td>
          </tr>)
      }
      
      setPollsData(<table className='pollTable'>{pollArr}</table>)

    })
  }
  return(
      pollsData
  )
}


function AppDesktop(props){

  const navigate = useNavigate();
  const [musicData,setMusic]=useState([])
  const [update,setUpdate]=useState(0)
  theme = useContext(box.ThemeContext)
  document.body.style="transition:all;height: 100%; 0.2s; background:"+theme[0]+";"

  useEffect(() => {
    updateUI()
  },[])

  const updateUI=()=>{
    box.ThemeContext = createContext(box.updateThemeList())
    setUpdate(Math.random())
  }

  let elem,navbar
  
  if(cookies.get("CookiesAllowed")){
    navbar = <box.ThemeContext.Provider value={theme}><NavBar mobile={props.mobile} update={updateUI}/></box.ThemeContext.Provider>
    elem =<box.ThemeContext.Provider value={theme}>
            <PollTable />
          </box.ThemeContext.Provider>
  }
  else elem = <ThemeContext.Provider value={theme}><CookiesPrompt update={updateUI}/></ThemeContext.Provider>
  return (
      <div className="mainLevel">
        <div className='topLevel'>
          {<box.Button style={String("ispace")}/>}
          {<box.Menu update={updateUI}/>}
          {<box.Button style={String("ilightDark")} onclick={()=>{box.lightMode();updateUI()}}/>}
          {<box.Button style={String("iterminal")} onclick={()=>{navigate("/login");}} />}
        </div>
        {navbar}
        <div className='spaceElement'></div>
        {elem}
      </div>
  )
}

export default AppDesktop;

  