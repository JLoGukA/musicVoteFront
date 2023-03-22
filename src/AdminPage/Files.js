import { React, useState, useEffect, useRef, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Cookies from 'universal-cookie';
import { saveAs } from 'file-saver';


import '../css/App.css';
import '../css/FileTable.css'

import box from "../Elements"

const cookies = new Cookies();
const ThemeContext = createContext(box.updateThemeList())

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function NavBarAdmin(props){
    const theme = useContext(ThemeContext)
    const navigate = useNavigate()
    return(
          <div className={"navbar " + theme[1]}>
              <div className="navbarchild">
                  {<box.Button theme={theme[2]} text="Файлы" style={String("ifile")} onclick={()=>{navigate('/files')}}/>}
                  {<box.Button theme={theme[2]} text="Расписание" style={String("ischedule")} onclick={()=>{navigate('/admin')}}/>} 
                  {<box.Button theme={theme[2]} text="Устройства" style={String("idevice")} onclick={()=>{navigate('/admin')}}/>}   
              </div>
              <div className="navbarchild">
                  {<box.Button theme={theme[2]} style={String("ishutdown")} text="Выход" onclick={()=>{navigate("/");cookies.remove("admin")}}/>}
              </div>
          </div>   
    ) 
}

function FileTable(props){
    const theme = useContext(ThemeContext)
    const [files,setFiles]=useState({})

    useEffect(()=>{
      updateTable()
    },[])

    const updateTable=async()=>{
      await axios({
        url:"http://192.168.3.3:3005/file/generate",
        method:'GET',
      }).then((res)=>{
        setFiles(res.data)
      }).catch((error)=>{alert(error)})
    }
    
    const download=async(file)=>{
      let encfile = encodeURI(file)
      await axios({
          url:"http://192.168.3.3:3005/file/download",
          method:'GET',
          responseType:'blob',
          headers:{
            'filename': encfile,
            'gen':'1'
          }
        }).then((res)=>{
            const blob = new Blob([res.data], {
                type: 'application/octet-stream'
            })  
            saveAs(blob, file)
        })
    }

    const deleteFile=async(file)=>{
      let encname = encodeURI(file)
      await axios({
        url:"http://192.168.3.3:3005/file/delete",
        method:'POST',
        headers:{
          'gen':1,
          'filename': encname,
        }
      }).then(async(res)=>{
        updateTable()
      })
    }

    const handleKeyDown=async(e)=>{

      if(e==="Enter"){
        
        let name=document.getElementById("inputGenName").value+".wav"
        let text=document.getElementById("inputGenText").value
        let encname = encodeURI(name);
        let enctext = encodeURI(text)
        if(text.length===0)return
        
        await axios({
          url:"http://192.168.3.3:3005/file/generate",
          method:'GET',
          
          headers:{
              'file': encname,
              'text': enctext
          }
        }).then((res)=>{
          setFiles(res.data)
        }).catch((error)=>{alert(error)})
      }        
    }

    let fileArr=[]
    for(let i=0; i<files.length;i++){
      fileArr.push(
        <div className='fileTableRow'>
          <box.Button theme={theme[2]} style={String("itext")} text={files[i]} onclick={()=>{download(files[i])}}/>
          <div className='spaceElement'/>
          <box.Button theme={theme[2]} style={String("idelete")} onclick={()=>{deleteFile(files[i])}}/>
        </div>
      )
    }

    return(
        <div className="textAudioTable">
          <div className={theme[7]+" textAreaBack"} >
            <div style={{'display':'flex'}}>
              <box.InputField idx="inputGenName" theme={theme[6] + " textAudioInput"} onKey={handleKeyDown} text={"Имя файла"} display={true}/>
              <box.Button theme={theme[2]} style="iupload" className='shareButton' onclick={()=>{handleKeyDown("Enter")}}/>
              <box.Button theme={theme[2]} style={String("ilightDark")} onclick={()=>{updateTable()}}/>
            </div>
            <box.TextArea idx="inputGenText" theme={theme[6] + " textArea"} onKey={handleKeyDown} text={"Текст для генерации"} display={true}/>
          </div>
          <div style={{'display':'flex','flex-direction':'column'}}>
            {fileArr}
          </div>
        </div>
    )
}


function Files(){
    
  const navigate = useNavigate()
  if(cookies.get("CookiesAllowed")===undefined||cookies.get("admin")===undefined){navigate("/")}

  const [update,doUpdate]=useState(0)
  const [theme,setTheme]=useState({})

  document.body.className = theme[0];

  useEffect(() => {
    doUpdate(Math.random())
  },[])

  useEffect(()=>{
    setTheme(box.updateThemeList())
  },[update])

  let elem,navbar
  
  navbar = <ThemeContext.Provider value={theme}><NavBarAdmin mobile={0} update={doUpdate} /></ThemeContext.Provider>
  elem=<ThemeContext.Provider value={theme}><FileTable/></ThemeContext.Provider>
  return (
      <div className="mainLevel">
        <div className='topLevel'>
          {<box.Button  style={String("ispace")}/>}
          {<box.Menu emplace={1} update={doUpdate}/>}
          {<box.Button theme={theme[2]} style={String("ilightDark")} onclick={()=>{box.lightMode();doUpdate(Math.random())}}/>}
          {<box.Button theme={theme[2]} style={String("iterminal")} onclick={()=>{navigate('/')}} />}
        </div>
        {navbar}
        <div className='spaceElement'></div>
        {elem}
      </div>
  )
}

export default Files;

  