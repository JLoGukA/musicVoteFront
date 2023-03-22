import { React, useState, useEffect, useRef, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Cookies from 'universal-cookie';
import { saveAs } from 'file-saver';

import '../css/App.css';

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

function AllDevices(props){
    const [devices,setDevices]=useState({})
    const [deviceFile,setDeviceFile]=useState({})
    const [showFiles,setShowFiles]=useState({})
    const fileInputRef=useRef()
    const [textField,setTextFieldOn]=useState({})
    const [info,setInfo]=useState(0)
    const theme = useContext(ThemeContext)

    const updateDevices=async()=>{
        const getDevicesInfo=async()=>{
            await((axios.get("http://localhost:3005/device/info"))).then((res)=>{
            setDevices(res.data.deviceInfo)
            setDeviceFile(res.data.deviceFile)
            })
        }
        setShowFiles({})
        getDevicesInfo()
        await timeout(10)
        let arr=[]
        arr[info]=true
        setShowFiles(arr)
    }
    useEffect(() => {
        updateDevices()
    },[])
    const handleChange=async(e)=>{
        if(e.target.files){
          
            let formData=new FormData()
            formData.append('file',e.target.files.item(0))
            formData.append('fileName',e.target.files.item(0).name)
            formData.append('contentType',e.target.files.item(0).type)
            formData.append('contentLength',e.target.files.item(0).size)
            formData.append('saveDir',document.getElementById("FileSaveDir").value)
            formData.append('ip',devices[info][1])
          
            await axios.post('http://192.168.3.3:3005/file/upload',formData).then(async(res)=>{
                if(res.data==="OK"){
                    await updateDevices()
                }
            })
        }
    }

    const fileManage=async(dir,num,del)=>{
        if(del!==undefined){
            setInfo(num)
            await axios({
            url:"http://192.168.3.3:3005/file/delete",
            method:'POST',
            headers:{
              'ip': devices[info][1],
              'dir': dir,
            }
        }).then(async(res)=>{
            await updateDevices()
        })
        }
        else{
            if(textField[num]===true){//upload
                setInfo(num)
                let i=dir.length-1
                while(dir[i]!=='/')i--;
                let str=dir.slice(0,++i)
                navigator.clipboard.writeText(str)
                document.getElementById('FileSaveDir').value=str
                handleKeyDown("Enter")
            }
            else{//download
                setInfo(num)
                let i=dir.length-1
                while(dir[i]!=='/')i--;
                let str=dir.slice(++i,dir.length)
                await axios({
                    url:"http://192.168.3.3:3005/file/download",
                    method:'GET',
                    responseType:'blob',
                    headers:{
                    'ip': devices[info][1],
                    'file': dir,
                    'fileName':str,
                    }
                }).then((res)=>{
                    const blob = new Blob([res.data], {
                        type: 'application/octet-stream'
                    })  
                    saveAs(blob, str)
                })
            } 
        }
    }
    const handleKeyDown=async(e)=>{
        if(e==="Enter"){
            fileInputRef.current.click()
        }
    }
    let array=[]
    for(let i=0; i<deviceFile.length;i++){
        array.push([])
        for(let j=0;j<deviceFile[i].length;j++){
            array[i].push(
                <div className='deviceFileTable'>
                    <div style={{'display':'flex'}}>
                        <text style={{'font-size':'20px',"align-self":'center'}}>{j+1}</text>
                        <box.Button theme={theme[2]} style={String("itext")} text={deviceFile[i][j]} onclick={() => {fileManage(deviceFile[i][j],i)}}/>
                        {/* {alert(deviceFile[i][j])} */}

                    </div>
                    <div className="spaceElement"/>
                    <box.Button theme={theme[2]} style={String("idelete")} onclick={() => {fileManage(deviceFile[i][j],i,1)}}/>
                </div>
            )
        }
    }

    let array2=[]
  
    let deviceID
    for(let i=0; i<devices.length;i++){
        if(deviceID!==devices[i][0]){
            array2.push(
                <div className='deviceBack'>
                    <div className='device'>
                        <box.Button theme={theme[2]} style={String("idevice")} text={"Устройство: "+devices[i][0]} onclick={()=>{updateDevices()}}/>
                      
                        <text>{"IP: "+devices[i][1]}</text>
                        <box.Button theme={theme[2]} style={String("itext")} text="Загрузить файл" onclick={()=>{textField[i]=!textField[i];setInfo(Math.random())}} />
                        <box.InputField theme={theme[6]} idx="FileSaveDir" type="text" text="Куда" onKey={handleKeyDown} display={textField[i]}/>
                      
                        <input id="SENDFILE" type="file" ref={fileInputRef} onChange={handleChange} onClick={(e)=>{e.target.value=null}} style={{'display':'none'}}></input>
                    </div>
                    <div className='deviceFiles'>
                        <box.Button theme={theme[2]} style={String("itext")} text="Файлы" onclick={()=>{;showFiles[i]=!showFiles[i];setInfo(Math.random())}}/>
                      
                        {(showFiles[i]===true) ? array[i]:<div/>}
                      
                    </div>
                </div>
            )
        }
        deviceID=devices[i][0]
    }

    if(array2.length){
        return(
            <div className='deviceInfo'>
                {array2}
            </div>
        )
    } 
    else return (<div></div>)
}


function AdminPage(){
    
    const navigate = useNavigate()
    if(cookies.get("CookiesAllowed")===undefined||cookies.get("admin")===undefined){navigate("/")}

    const [update,doUpdate]=useState(0)
    const [theme,setTheme]=useState({})
    //alert(theme)

    document.body.className = theme[0];

    useEffect(() => {
        doUpdate(Math.random())
    },[])

    useEffect(()=>{
        setTheme(box.updateThemeList())
    },[update])

    let elem,navbar
  
    navbar = <ThemeContext.Provider value={theme}><NavBarAdmin mobile={0} update={doUpdate} /></ThemeContext.Provider>
    elem=<ThemeContext.Provider value={theme}><AllDevices update={doUpdate}/></ThemeContext.Provider>
  
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

export default AdminPage;

  