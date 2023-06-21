import { React, useState, useEffect, useRef, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Cookies from 'universal-cookie';
import { saveAs } from 'file-saver';


import '../css/App.css';
import '../css/FileTable.css'

import box from "../Elements"

const cookies = new Cookies();
var theme

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function FileTable(props){
    const [files,setFiles]=useState({})

    useEffect(()=>{
      updateTable()
    },[])

    const updateTable=async()=>{

      await axios({
        url:box.serverIP+"/file/generate",
        method:'GET',
      }).then((res)=>{
        setFiles(res.data)
        
      }).catch((error)=>{})
    }
    
    const download=async(file)=>{
      let encfile = encodeURI(file)
      await axios({
          url:box.serverIP+"/file/download",
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
        url:box.serverIP+"/file/delete",
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
          url:box.serverIP+"/file/generate",
          method:'GET',
          headers:{
              'file': encname,
              'text': enctext
          }
        }).then((res)=>{
          updateTable()
        }).catch((error)=>{})
      }        
    }

    let fileArr=[]
    for(let i=0; i<files.length;i++){
      fileArr.push(
        <div className='fileTableRow'>
          <box.Button style={String("itext")} text={files[i]} onclick={()=>{download(files[i])}}/>
          <div className='spaceElement'/>
          <box.Button style={String("idelete")} onclick={()=>{deleteFile(files[i])}}/>
        </div>
      )
    }

    return(
        <div className={"backSurface "+theme[7]}>
          <span>
            <div style={{'display':'flex'}}>
              <input type="text" id="inputGenName" className={"textInput "+theme[6]} onKeyDown={(e)=>{handleKeyDown(e.key)}} placeholder="Имя файла"/>
              <box.Button style="iupload" className='shareButton' onclick={()=>{handleKeyDown("Enter")}}/>
              <box.Button style={String("iupdate")} onclick={()=>{updateTable()}}/>
            </div>
            <textarea id="inputGenText" className={theme[6] + " textArea"} onKeyDown={(e)=>{handleKeyDown(e.key)}} placeholder="Текст для генерации"/>
          </span>
          <div className="fileArea">
            {fileArr}
          </div>
        </div>
    )
}


function Files(){
    
  const navigate = useNavigate()
  const [update,setUpdate]=useState(0)
  theme = useContext(box.ThemeContext)
  if(cookies.get("CookiesAllowed")===undefined||cookies.get("admin")===undefined){navigate("/")}
  document.body.style="transition:all 0.2s; background:"+theme[0]+";"

  useEffect(() => {
    updateUI()
  },[])

  const updateUI=()=>{
    box.ThemeContext = createContext(box.updateThemeList())
    setUpdate(Math.random())
  }

  let elem,navbar
  
  navbar = <box.ThemeContext.Provider value={theme}><box.NavBarAdmin/></box.ThemeContext.Provider>
  elem=<box.ThemeContext.Provider value={theme}><FileTable/></box.ThemeContext.Provider>
  return (
      <div className="mainLevel">
        <div className='topLevel'>
          {<box.Button  style={String("ispace")}/>}
          {<box.Menu emplace={1} update={updateUI}/>}
          {<box.Button style={String("ilightDark")} onclick={()=>{box.lightMode();updateUI()}}/>}
          {<box.Button style={String("iterminal")} onclick={()=>{navigate('/')}} />}
        </div>
        {navbar}
        <div className='spaceElement'></div>
        {elem}
      </div>
  )
}

export default Files;

  