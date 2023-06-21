import React from 'react'
import { useState,useEffect,useContext, createContext }from 'react';
import themes from './themes';
import Cookies from 'universal-cookie';
import { useNavigate} from 'react-router-dom';

import './css/NavBar.css'
import './css/NavButton.css'
import './css/Poll.css'
import './css/themes.css'
import './css/AdminThings.css'

import ialign from './asset/align.svg'
import iclock from './asset/clock.svg'
import ialignnot from './asset/alignnot.svg'
import idiscard from './asset/discard.svg'
import idevicenot from './asset/devicenot.svg'
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
import ilogout from './asset/logout.svg'
import idevice from './asset/device.svg'
import idevicesmall from './asset/devicesmall.svg'
import ifile from './asset/file.svg'
import ilightDark from './asset/lightDark.svg'
import idelete from './asset/delete.svg'
import iupload from './asset/upload.svg'
import iadd from './asset/add.svg'
import icopy from './asset/copy.svg'
import iupdate from './asset/update.svg'
import idownload from './asset/download.svg'
import iplay from './asset/play.svg'
import ipause from './asset/pause.svg'
import ipower from './asset/power.svg'
import itv from './asset/tv.svg'
import itvM from './asset/tvM.svg'
import iaudiochat from './asset/audiochat.svg'

const tinyimage="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const serverIP="http://localhost:40005"
const cookies = new Cookies();

var themeList=themes.GetThemeList()
var ThemeContext = createContext(themeList)

function UpdateThemeList(){
    themeList=themes.GetThemeList();
    ThemeContext = createContext(themeList)
    return themeList
}

const dict={
    iadd:{image:iadd},
    iaddsmall:{image:iadd},
    ialign:{image:ialign},
    ialignnot:{image:ialignnot},
    iaudiochat:{image:iaudiochat},
    iblue:{image:iblue},
    ibmstu:{image:ibmstu},
    ibmstuM:{image:ibmstu},
    iclock:{image:iclock},
    idelete:{image:idelete},
    idevice:{image:idevice},
    idevicenot:{image:idevicenot},
    idevicesmall:{image:idevicesmall},
    idiscard:{image:idiscard},
    idownload:{image:idownload},
    ifile:{image:ifile},
    igear:{image:igear},
    igearM:{image:igear},
    igreen:{image:igreen},
    ilightDark:{image:ilightDark},
    ilogout:{image:ilogout},
    inote:{image:inote},
    inoteM:{image:inote},
    ipalette:{image:ipalette},
    ipause:{image:ipause},
    iplay:{image:iplay},
    ipower:{image:ipower},
    ired:{image:ired},
    ischedule:{image:ischedule},
    ischeduleM:{image:ischedule},
    ispace:{image:ispace},
    iterminal:{image:iterminal},
    itext:{image:""},
    itv:{image:itv},
    itvM:{image:itvM},
    iupdate:{image:iupdate},
    iupload:{image:iupload},    
}

function Button(props){
    const theme=useContext(ThemeContext)
    const onclick = async () =>{
        
        if(props.onclick!==undefined)props.onclick();
        
        if(props.link!==undefined)document.location.href=props.link;
    }
    if(props.mobile){
        return(
            <div className={"Back "+ theme[2]+"Back"} >
                <div className={props.menu===true ? "btnAll "+props.style:"btnAll "+props.style+" "+theme[2]} onClick={()=>{onclick()}}>
                    <img src={(dict[props.style]!==undefined) ? dict[props.style].image:tinyimage} alt={""}></img>
                    
                    <text style={{'font-size':'10px'}}>{props.text}</text>
                </div>
            </div>
        )
    }
    else{
        return(
            <div className={"Back "+ theme[2]+"Back"} onMouseDown={(e)=>{e.preventDefault();if(e.button===1)window.open(props.link,"_blank")}}>
                <div className={props.menu===true ? "btnAll "+props.style:"btnAll "+props.style+" "+theme[2]} onClick={()=>{onclick()}}>
                    <img src={(dict[props.style]!==undefined) ? dict[props.style].image:tinyimage} alt={""}></img>
                    <div style={{'height':'10px'}}></div>
                    <div className='itext'>{(props.text) ? props.text:" "}</div>
                </div>
            </div>
        )
    }
}

function Menu(props){
    const [show,setShow]=useState(0)
    const [menuList,setMenuList]=useState([])

    useEffect(() => {
        let list=[
            <div onClick={()=>{onclick(0)}}><Button style={String("ired")} menu={true}/></div>,
            <div onClick={()=>{onclick(1)}}><Button style={String("igreen")} menu={true}/></div>,
            <div onClick={()=>{onclick(2)}}><Button style={String("iblue")} menu={true}/></div>
        ]
        setMenuList(list)
    },[])

    const onclick=(num)=>{
        if(num===0)cookies.set("themeColor",3)
        else if(num===1)cookies.set("themeColor",4)
        else if(num===2)cookies.set("themeColor",2)
        UpdateThemeList()
        props.update()
    } 
    
    return(
        <div className='menu' onClick={()=>{setShow(!show)}}>
            <Button style={String("ipalette")} menu={show}/>
            {show ? menuList:<></>}
        </div>
    )
}




const LightMode=()=>{
    if(cookies.get("themeLight")!==undefined){
        if(cookies.get("themeLight")=="0"){
            cookies.set("themeLight",1)
        }
        else {
            cookies.set("themeLight",0)
        }
        UpdateThemeList()
        
    }
    else {
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        if(prefersDark){
            cookies.set("themeLight",0);
            cookies.set("themeColor",4);
        }
        else{
            cookies.set("themeLight",1);
            cookies.set("themeColor",4);
        }
        UpdateThemeList()
    }
}

function NavBarAdmin(props){
    const theme=useContext(ThemeContext)
    const navigate = useNavigate()
    return(
        <div className={"navbar " + theme[1]}>
            <div className="navbarchild">
                {<Button text="Голосование" style={String("inote")} onclick={()=>{navigate('/voteSettings')}}/>} 
                {<Button text="Генерация аудио" style={String("iaudiochat")} onclick={()=>{navigate('/files')}}/>}
                {<Button text="Расписание" style={String("ischedule")} onclick={()=>{navigate('/schedule')}}/>} 
                {<Button text="Устройства" style={String("idevice")} onclick={()=>{navigate('/devices')}}/>}   
                   
            </div>
            <div className="navbarchild">
                {<Button style={String("ilogout")} text="Выход" onclick={()=>{cookies.remove("admin");navigate("/");}}/>}
            </div>
        </div>   
    ) 
}

var box={Button,Menu,updateThemeList:UpdateThemeList,lightMode:LightMode, NavBarAdmin,serverIP,ThemeContext}
export default box;
