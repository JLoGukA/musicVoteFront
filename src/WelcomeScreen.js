import React from 'react'
import { useState}from 'react';
import themes from './themes';
import axios from 'axios'
import Cookies from 'universal-cookie';
import { useEffect } from 'react';
import {useRef} from 'react';


import './css/NavBar.css'
import './css/NavButton.css'
import './css/Poll.css'
import './css/themes.css'
import './css/LogInBox.css'
import './css/AdminThings.css'


import ispace from './asset/space.png'
import inote from './asset/note.svg'
import ibmstu from './asset/logo-bmstu.svg'
import ischedule from './asset/schedule.svg'
import igear from './asset/gear.svg'
import ipalette from './asset/colors/palette.svg'
import igreen from './asset/colors/green.svg'
import iblue from './asset/colors/blue.svg'
import ired from './asset/colors/red.svg'
import iterminal from './asset/terminalThick.svg'
import ishutdown from './asset/shutdown.svg'
import idevice from './asset/device.svg'
import ifile from './asset/file.svg'
import ilightDark from './asset/lightDark.svg'



const tinyimage="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const cookies = new Cookies();
var elementsNum=6;

var themeList=themes.getThemeList(elementsNum)

function updateThemeList(){
    themeList=themes.getThemeList(elementsNum);
    return themeList[0]
}

function typeOf(obj) {
    return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}

const dict={
    inote:{image:inote},
    ibmstu:{image:ibmstu},
    ischedule:{image:ischedule},
    igear:{image:igear},
    ispace:{image:ispace},
    itext:{image:""},
    ipalette:{image:ipalette},
    ired:{image:ired},
    igreen:{image:igreen},
    iblue:{image:iblue},
    iterminal:{image:iterminal},
    ishutdown:{image:ishutdown},
    idevice:{image:idevice},
    ilightDark:{image:ilightDark},
    ifile:{image:ifile},

    inoteM:{image:inote},
    ibmstuM:{image:ibmstu},
    ischeduleM:{image:ischedule},
    igearM:{image:igear},
}

function Button(props){
    var btheme=themeList[2]

    const onclick = async () =>{
        if(props.style==="igear"){
            cookies.remove("VoteAccepted")
            cookies.remove("CookiesAllowed")
            document.location.href="/"
        }
        if(props.onclick!==undefined)props.onclick();
        
        if(props.link!==undefined)document.location.href=props.link;
    }
    if(props.mobile){
        return(
            <div className={"Back "+ btheme+"Back"}>
                <div className={props.menu===true ? "btnAll "+props.style:"btnAll "+props.style+" "+btheme} onClick={()=>{onclick()}}>
                    <img src={(dict[props.style]!==undefined) ? dict[props.style].image:tinyimage} alt={""}></img>
                </div>
            </div>
        )
    }
    else{

        return(
            <div className={"Back "+ btheme+"Back"}>
                <div className={props.menu===true ? "btnAll "+props.style:"btnAll "+props.style+" "+btheme} onClick={()=>{onclick()}}>
                    <img src={(dict[props.style]!==undefined) ? dict[props.style].image:tinyimage} alt={""}></img>
                    <div style={{'height':'10px'}}></div>
                    <text>{props.text}</text>
                </div>
            </div>
        )
    }
}


function Menu(props){
    const [show,setShow]=useState(0)

    const onclick=(num)=>{
        if(num===0)cookies.set("themeColor",3)
        else if(num===1)cookies.set("themeColor",4)
        else if(num===2)cookies.set("themeColor",2)
        props.update()
    }
    var menuList
    if(show&&props.emplace===1){
        menuList=[
            <div onClick={()=>{onclick(0)}}><Button style={String("ired")} menu={true}/></div>,
            <div onClick={()=>{onclick(1)}}><Button style={String("igreen")} menu={true}/></div>,
            <div onClick={()=>{onclick(2)}}><Button style={String("iblue")} menu={true}/></div>
            ]
    }
    else if(show&&props.elems!==undefined){
        menuList=[]
        for(var i=0; i<props.num; i++){
            menuList.push(props.elems[i])
        }
    }
    
    
        return(
            <div className='menu' onClick={()=>{setShow(!show)}}>
                <Button style={String("ipalette")} menu={show}/>
                {menuList}
            </div>
        )
    
    
}

function InputField(props){
    const [inputText, setInputText] = useState("");
    const [display,setDisplay]=useState(props.display)
    
    const HandleChange = (event) =>{
        setInputText(event.target.value);
    }
    if(props.display){
        return(
            <input
            className={"inputField " + themeList[6]} 
            id={props.idx!==undefined ? props.idx:""} 
            type={props.type!==undefined ? props.type:"text"} value={inputText} 
            onChange={HandleChange} 
            placeholder={props.text!==undefined ? props.text:""}
            onKeyDown={(e)=>{ props.onKey(e.key)}}
            />
        )
    }
    else return(<div></div>)
    
}

function LogInBox(props){
    
    const onKeyEnter=async(e)=>{
        if(e==="Enter"){
            const res = await fetch("http://localhost:3005/user/login", {
                method: "POST",
                headers: {"Content-Type": "application/JSON"},
                body: JSON.stringify({"login":document.getElementById("login").value,"pass":document.getElementById("pass").value})
            }).then((res) => res.json());

            if(res===1){
                cookies.set("admin",'1');
                props.setAdmin(1);
                props.setLogin(0);
                props.update()
            }
            else alert("Неправильный логин или пароль")
            
        }
    }
    const l=<InputField idx="login" text="Логин" display={1}/>
    const p =<InputField idx="pass" text="Пароль" onKey={onKeyEnter} type="password" display={1}/>
    return(
        <div className="logInBox">
            {l}
            {p}
            <Button style={String('itext')} text="Войти" onclick={()=>{onKeyEnter("Enter")}}/>
        </div>
    )
}



function NavBar(props){
    var ntheme = themeList[1]

    if(props.mobile===1){
        return(
        <div>
            <div className={"navbar_mobile "+ntheme}>
                
                {<Button link="https://mf.bmstu.ru/" style={String("ibmstuM")} mobile={true}/>}
                {<Button link="http://rasp.msfu.ru/" style={String("ischeduleM")} mobile={true}/>}
                
                {<Button style={String("igearM")} mobile={true}/>}
                {<Button link="http://rasp.msfu.ru/" style={String("inoteM")} mobile={true}/>}
                
            </div>  
        </div> 
        )  
    } 
    else{
        return(
                <div className={"navbar " + ntheme}>
                    <div className="navbarchild">
                        {<Button link="https://mf.bmstu.ru/" text="МФ МГТУ" style={String("ibmstu")}/>}
                        {<Button link="http://rasp.msfu.ru/" text="Расписание" style={String("ischedule")}/>} 
                    </div>
                    
                    <div className="navbarchild">
                        {<Button style={String("igear")}/>}
                        {<Button link="http://rasp.msfu.ru/" text="Предложить музыку" style={String("inote")}/>}
                    </div>
                    
                </div>   
        ) 
    }
}

function NavBarAdmin(props){
    var ntheme = themeList[1]

    if(props.mobile===1){
        return(
        <div>
            <div className={"navbar_mobile "+ntheme}>
                {<Button link="https://mf.bmstu.ru/" style={String("ibmstuM")} mobile={true}/>}
                {<Button link="http://rasp.msfu.ru/" style={String("ischeduleM")} mobile={true}/>}
                
                {<Button style={String("igearM")} mobile={true}/>}
                {<Button link="http://rasp.msfu.ru/" style={String("inoteM")} mobile={true}/>}
                
            </div>  
        </div> 
        )  
    }
    else{
        return(
                <div className={"navbar " + ntheme}>
                    <div className="navbarchild">
                        {<Button text="Все файлы" style={String("ifile")}/>}
                        {<Button text="Расписание аудио" style={String("ischedule")}/>} 
                        {<Button text="Подключенные устройства" style={String("idevice")} />}
                        
                    </div>
                    
                    <div className="navbarchild">
                        {<Button style={String("ishutdown")} text="Выход" onclick={()=>{props.setAdmin(0);cookies.remove("admin");props.update()}}/>}
                    </div>
                    
                </div>   
        ) 
    }
}

function AllDevices(props){
    const [devices,setDevices]=useState([])
    const [deviceFile,setDeviceFile]=useState([])
    const [showFiles,setShowFiles]=useState([])
    const fileInputRef=useRef()
    const [textField,setTextFieldOn]=useState(false)
    useEffect(() => {
        getDevicesInfo()
    },[])

    let deviceID,countID=0
    const getDevicesInfo=async()=>{
        let getDevices = ((await axios.get("http://localhost:3005/device/info")).data)
        setDevices(getDevices.deviceInfo)
        
        for(let i=0; i<getDevices.deviceFile.length;i++){
            for(let j=0;j<getDevices.deviceFile[i].length;j++){
                getDevices.deviceFile[i][j]=(<Button style="itext" text={getDevices.deviceFile[i][j]}/>)
            }
        }
        setDeviceFile(getDevices.deviceFile)
    }
    let deviceArray=[]
    deviceID=0
    countID=0
    
    const handleChange=async(e)=>{
        if(e.target.files){
            //setFile(e.target.files.item(0))
            const formData=new FormData()
            formData.append('file',e.target.files.item(0))
            formData.append('fileName',e.target.files.item(0).name)
            formData.append('contentType',e.target.files.item(0).type)
            formData.append('contentLength',e.target.files.item(0).size)
            formData.append('saveDir',"files/")
            await axios.post('http://192.168.3.3:3005/file/upload',formData)
        }
    }

    const handleKeyDown=async(e)=>{
        if(e==="Enter"){
            fileInputRef.current.click()
        }
    }
    
    
    for(let i=0; i<devices.length;i++){
        if(deviceID!==devices[i][0]){
            deviceArray.push(
                <div className='deviceBack'>
                    <div className='device'>
                        <Button style="idevice" text={"Устройство: "+devices[i][0]} onclick={()=>{getDevicesInfo()}}/>
                        <text>{"IP: "+devices[i][1]}</text>
                        <Button style="itext" text="Загрузить файл" onclick={()=>{setTextFieldOn(!textField)}} />
                        <InputField type="text" text="Куда" onKey={handleKeyDown} display={textField}/>
                        {/* <input type="text" style={{'display':{}}} onKeyDown={(e)=>{handleKeyDown(e)}}/> */}
                        <input type="file"  ref={fileInputRef} onChange={handleChange} style={{'display':'none'}}></input>
                    </div>
                    <div className='deviceFiles'>
                        <Button style={String("itext")} text="Файлы" onclick={()=>{showFiles[i]=!showFiles[i];props.update()}}/>
                        {showFiles[i]==true ? deviceFile[i]:<div/>}
                    </div>
                </div>
            )
        }
        deviceID=devices[i][0]
    }
    
    return(
        <div className='deviceInfo'>
            {deviceArray}
            
        </div>
    )
}

function Poll(props){
    /* 
    All songs names(array) = musicData[0], 
    Votes for every song(array) = musicData[1] 
    Amount of songs = musicData[2], 
    Amount of all votes = musicData[3] */

    const [active, setActive]=useState(false)
    const [voted, setVoted]=useState(-1)
    const elements=[]

    for(let i=0;i<props.musicData[2];i++){

        let y = parseInt(props.musicData[1][i],10)

        if(!active){
            elements[i]=(
                        <div className={'pollElem '+themeList[5]} onClick={() => {update(i,y)}}>
                            <h2>{props.musicData[0][i]}</h2>
                        </div>
                        )
        }
        else{
            elements[i]=(<div className="elemCont">
                            <h2>{props.musicData[0][i] + " - "+(y / props.musicData[3] * 100).toFixed(2) + "%"}</h2>
                            <div className={(voted===i) ? 'pollElem' : 'pollElem'}>
                                <div className={(y!==0) ? "progress-bar "+themeList[4]:""} style={
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
        <div className={"poll "+themeList[3]}>
            <h1>Какая музыка будет играть на следующем перерыве?</h1>
            {elements}
        </div>
    )
}

function CookiesPrompt(props){
    const CookiesEnable =()=>{
        props.allowCookies(1)
        props.makeUpdate()
    }
    return(
        <div className={"pollCookies " +themeList[3]} >
            <h1 class="pollHeader">Этот сайт использует Cookies. Разрешить их создание и хранение?</h1>
            <div className="pollCookiesRow">
                <Button link="https://mf.bmstu.ru/" text="Нет" style={String("itext")}/>
                <Button text="" style={String("ispace")}/>
                <Button text="Да" style={String("itext")} onclick={()=>{CookiesEnable()}}/>
            </div>
        </div>
    )
}

var box={NavBar,Poll,Button,CookiesPrompt,Menu, LogInBox,NavBarAdmin,updateThemeList,AllDevices}
export default box;
