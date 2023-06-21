import { React, useState, useEffect, useRef, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Cookies from 'universal-cookie';
import { saveAs } from 'file-saver';

import '../css/App.css';

import box from "../Elements"

const cookies = new Cookies();
var theme

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const configDictionary={
    0:"ИД",
    1:"Громкость",
    2:"LRC",
    3:"BCK",
    4:"DATA",
    5:"Имя WiFi",
    6:"Пароль WiFi",
    7:"Адрес сервера",
    8:"Порт сервера",
    9:"Имя точки доступа",
    10:"Пароль точки доступа",
    11:"Сервер времени",
    12:"Смещение по времени(сек)",
}


function AllDevices(props){
    const [devices,setDevices]=useState({})
    const [deviceFile,setDeviceFile]=useState({})
    const [deviceConfig,setDeviceConfig]=useState({})
    const [showFiles,setShowFiles]=useState({})
    const [showTextField,setShowTextField]=useState({})
    const [showConfigField,setShowConfig]=useState({})
    const [playNowField,setPlayNowField]=useState({})
    const [info,setInfo]=useState(0)
    const fileInputRef=useRef()
    const updateDevices=async(id)=>{
        const getDevicesInfo=async()=>{
            await((axios.get(box.serverIP+"/device/info"))).then((res)=>{
                setDevices(res.data.deviceInfo)
                setDeviceFile(res.data.deviceFile)
                setDeviceConfig(res.data.deviceConfig)
            })
        }
        
        setShowFiles({})
        await getDevicesInfo()
        await timeout(10)
        let arr=[]
        if(id!==undefined)arr[id]=true
        setShowFiles(arr)
    }
    useEffect(()=>{
        
    },[playNowField])

    useEffect(() => {
        updateDevices()
    },[])

    const handleChange=async(e)=>{
        if(e.target.files){
          
            let formData=new FormData()
            let fileName = encodeURI(e.target.files.item(0).name)
            let saveDir = encodeURI(document.getElementById("FileSaveDir").value)

            formData.append('file',e.target.files.item(0))
            formData.append('fileName',fileName)
            formData.append('contentType',e.target.files.item(0).type)
            formData.append('contentLength',e.target.files.item(0).size)
            formData.append('saveDir',saveDir)
            formData.append('ip',devices[info][1])
          
            await axios.post(box.serverIP+"/device/fileUpload",formData).then(async(res)=>{
                if(res.data==="OK"){
                    await updateDevices()
                    alert("Успешно отправлено")
                }
                else if(res.status > 400) alert("Ошибка отправки")
            })
        }
    }
    
    //If file prop!== "stop" requests playing file on a device. Else requests to stop playing.
    const playNow=async(num,id,ip,file)=>{
        let encid=encodeURI(id)
        let encip=encodeURI(ip)
        let encfile=encodeURI(file)
        await axios.get(box.serverIP+"/device/playNow",{headers:{
         id:encid,
         ip:encip,
         file:encfile   
        }}).then((res)=>{
            if(res.data[0]==='/'){
                devices[num][3]=res.data.substr(1);
            }
            else if(res.data==="stop") {
                devices[num][3]=undefined;
            }
            else alert("Ошибка воспроизведения: "+res.data)
        }).catch((err)=>{})
        
        setInfo(Math.random())
    }

    const fileManage=async(dir,num,act)=>{
        if(act===0){//download
            setInfo(num)
            let i=dir.length-1
            while(dir[i]!=='/')i--;
            let str=dir.slice(++i,dir.length)
            await axios({
                url:box.serverIP+"/device/fileDownload",
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
        else if(act===1){//delete
            setInfo(num)
            await axios({
                url:box.serverIP+"/device/fileDelete",
                method:'POST',
                headers:{
                'ip': devices[info][1],
                'dir': dir,
                }
            }).then(async(res)=>{
                await updateDevices()
            })
        }
        else if(act===2){//upload
            setInfo(num)
            let i=dir.length-1
            while(i!==-1&&dir[i]!=='/')i--;
            let str=dir.slice(0,++i)
            navigator.clipboard.writeText(str)
            document.getElementById('FileSaveDir').value=str
            fileInputRef.current.click()
        }
    }
    const handleKeyDown=async(e)=>{
        if(e==="Enter"){
            fileInputRef.current.click()
        }
    }

    const changeDeviceConfig=async(e,param,value,ip)=>{
        if(e==="Enter"){
            let encvalue = encodeURI(value)
            axios.get(box.serverIP+"/device/updateConfig",{headers:{
                "param":param,
                "value":encvalue,
                "ip":ip
            }}).then((res)=>{if(res.status===200)alert("Перезагрузите устройство для обновления настроек")})
        }
    }

    const restart=async(ip)=>{
        axios.get(box.serverIP+"/device/restart",{headers:{
            "ip":ip
        }}).then((res)=>{if(res.status===200)alert("Перезагружено")})
    }

    let array=[],configArray=[]
    for(let i=0; i<deviceConfig.length;i++){
        configArray.push([])
        for(let j=0;j<deviceConfig[i].length;j++){
            configArray[i].push(
                <tr>
                    <td>
                        {configDictionary[j]+": "}
                    </td>
                    
                    <td>
                    <input id = {""+i+j} 
                    type="text" 
                    className={"inputConfig "+theme[6]} 
                    placeholder={deviceConfig[i][j]} 
                    onKeyDown={(e)=>{changeDeviceConfig(e.key,j,document.getElementById(""+i+j).value,devices[i][1])}}
                    />
                    </td>
                </tr>
            )
        }
        
    }

    
    for(let i=0; i<deviceFile.length;i++){
        array.push([])
        for(let j=0;j<deviceFile[i].length;j++){
            array[i].push(
                <div className={'deviceFileTable'}>
                    <div style={{'display':'flex'}}>
                        <p className={theme[7]}>{j+1}</p>
                        <box.Button style={String("itext")} text={deviceFile[i][j]} onclick={() => {fileManage(deviceFile[i][j],i,2)}}/>
                    </div>
                    
                    <div style={{'display':'flex'}}>
                        
                        {deviceFile[i][j][deviceFile[i][j].length-1]==='3' || deviceFile[i][j][deviceFile[i][j].length-1]==='v' || deviceFile[i][j][deviceFile[i][j].length-1]==='a' ? 
                            <box.Button style={String("iplay")} onclick={async() => {await playNow(i,devices[i][0],devices[i][1],deviceFile[i][j])}}/>:<></>
                        }
                        <box.Button style={String("idownload")} onclick={() => {fileManage(deviceFile[i][j],i,0)}}/>
                        <box.Button style={String("idelete")} onclick={() => {fileManage(deviceFile[i][j],i,1)}}/>
                    </div>
                    
                </div>
            )
        }
    }
    let array2=[]
  
    let deviceID
    for(let i=0; i<devices.length;i++){
        if(deviceID!==devices[i][0]){
            array2.push(
                <div className={'deviceBack ' + theme[7]}>
                    <div className='device'>
                        <box.Button style={String("idevice")} text={"Устройство: "+devices[i][0]} onclick={()=>{updateDevices(i)}}/>
                        <div className='deviceInfo'>
                            <p className={theme[7]}>{"Адрес: "+devices[i][1]}</p>
                            
                            {(devices[i][3]!==""&&devices[i][3]!==undefined) ? 
                            <div style={{'display':'flex'}}>
                                <p className={theme[7]}>{"Играет: "+devices[i][3]}</p>
                                <box.Button style={String("ipause")} onclick={async()=>{await playNow(i,devices[i][0],devices[i][1],"STOP")}} />
                            </div>:<></>}
                            
                        </div>
                        
                        
                        <input id="SENDFILE" type="file" ref={fileInputRef} onChange={handleChange} onClick={(e)=>{e.target.value=null}} style={{'display':'none'}}></input>
                        
                        
                    </div>
                    <div className='deviceFiles'>

                        <div className='deviceButtons'>
                            
                            <box.Button style={String("itext")} text="Файлы" onclick={()=>{showFiles[i]=!showFiles[i];setInfo(Math.random())}}/>
                            <box.Button style={String("itext")} text="Загрузить файл" onclick={()=>{showTextField[i]=!showTextField[i];setInfo(Math.random())}} />
                            <box.Button style={String("itext")} text="Настройки" onclick={()=>{showConfigField[i]=!showConfigField[i];setInfo(Math.random())}} />
                            <box.Button style={String("ipower")} onclick={()=>{restart(devices[i][1])}}/> 
                        </div>
                        
                        {(showFiles[i]===true) ? array[i]:<div/>}
                        <input className={"textInput "+theme[6]} 
                            id="FileSaveDir" 
                            type={showTextField[i] ? "text":"hidden"} 
                            placeholder={"введите директорию или нажмите на файл"}
                            onKeyDown={(e)=>{ handleKeyDown(e.key) }}
                        />
                        {(showConfigField[i]===true) ? <table>{configArray[i]}</table>:<div/>}
                      
                    </div>
                </div>
            )
        }
        deviceID=devices[i][0]
    }

    if(array2.length){
        return(
            <div className='deviceTable'>
                {array2}
            </div>
        )
    } 
    else return (<div></div>)
}


function Devices(){
    const navigate = useNavigate()
    if(cookies.get("CookiesAllowed")===undefined||cookies.get("admin")===undefined){navigate("/")}

    const [update,setUpdate]=useState(0)
    theme = useContext(box.ThemeContext)

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
    elem=<box.ThemeContext.Provider value={theme}><AllDevices update={updateUI}/></box.ThemeContext.Provider>
  
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

export default Devices;

  