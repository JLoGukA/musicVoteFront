import React from 'react'
import { useState}from 'react';
import themes from './themes';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

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
import ilogout from './asset/logout.svg'
import idevice from './asset/device.svg'
import ifile from './asset/file.svg'
import ilightDark from './asset/lightDark.svg'
import idelete from './asset/delete.svg'
import iupload from './asset/upload.svg'
import iadd from './asset/add.svg'
import iupdate from './asset/update.svg'
import idownload from './asset/download.svg'
import iplay from './asset/play.svg'
import ipause from './asset/pause.svg'
import ipower from './asset/power.svg'

const tinyimage="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const serverIP="http://localhost:3005"
const cookies = new Cookies();

var themeList=themes.GetThemeList()

function updateThemeList(){
    themeList=themes.GetThemeList();
    return themeList
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
    ilogout:{image:ilogout},
    idevice:{image:idevice},
    ilightDark:{image:ilightDark},
    ifile:{image:ifile},
    idelete:{image:idelete},
    iupload:{image:iupload},
    iadd:{image:iadd},
    iupdate:{image:iupdate},
    idownload:{image:idownload},
    iplay:{image:iplay},
    ipause:{image:ipause},
    ipower:{image:ipower},

    inoteM:{image:inote},
    ibmstuM:{image:ibmstu},
    ischeduleM:{image:ischedule},
    igearM:{image:igear},
}

function Button(props){
    
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
            <div className={"Back "+ props.theme+"Back"}>
                <div className={props.menu===true ? "btnAll "+props.style:"btnAll "+props.style+" "+props.theme} onClick={()=>{onclick()}}>
                    <img src={(dict[props.style]!==undefined) ? dict[props.style].image:tinyimage} alt={""}></img>
                </div>
            </div>
        )
    }
    else{
        return(
            <div className={"Back "+ props.theme+"Back"}>
                <div className={props.menu===true ? "btnAll "+props.style:"btnAll "+props.style+" "+props.theme} onClick={()=>{onclick()}}>
                    <img src={(dict[props.style]!==undefined) ? dict[props.style].image:tinyimage} alt={""}></img>
                    <div className='itext'>{(props.text) ? props.text:" "}</div>
                </div>
            </div>
        )
    }
}

function Menu(props){
    const [show,setShow]=useState(0)
    const navigate=useNavigate()


    const onclick=(num)=>{
        if(num===0)cookies.set("themeColor",3)
        else if(num===1)cookies.set("themeColor",4)
        else if(num===2)cookies.set("themeColor",2)
        props.update(Math.random())
        
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
            <Button style={String("ipalette")} theme={themeList[2]} menu={show}/>
            {menuList}
        </div>
    )
}

function InputField(props){
    const [inputText, setInputText] = useState("");
    
    const HandleChange = (event) =>{
        setInputText(event.target.value);
    }
    if(props.display===true){
        return(
            <input
            className={"inputField " + props.theme} 
            id={props.idx!==undefined ? props.idx:""} 
            type={props.display ? "text":"hidden"} 
            value={inputText} 
            onChange={HandleChange} 
            placeholder={props.text!==undefined ? props.text:""}
            onKeyDown={(e)=>{ props.onKey(e.key)}}
            />
        )
    }
    else return(<div></div>)
}

function TextArea(props){
    if(props.display===true){
        return(
            <textarea 
            className={'inputField ' + props.theme}
            id={props.idx!==undefined ? props.idx:""} 
            rows={props.rows!==undefined ? parseInt(props.rows):3}
            cols={props.cols!==undefined ? parseInt(props.cols):3}
            placeholder={props.text!==undefined ? props.text:""}
            />
        )
    }
}

const lightMode=()=>{
    if(cookies.get("themeLight")!==undefined&&cookies.get("themeColor")!==undefined){
        if(cookies.get("themeLight")==="0"){
            cookies.set("themeLight",1)
        }
        else {
            cookies.set("themeLight",0)
        }
    }
    else {
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        if(prefersDark){
            cookies.set("themeLight",1);
            cookies.set("themeColor",2);
        }
        else{
            cookies.set("themeLight",0);
            cookies.set("themeColor",2);
        }
    }
}

function NavBarAdmin(props){
    const navigate = useNavigate()
    return(
          <div className={"navbar " + props.theme[1]}>
              <div className="navbarchild">
                  {<box.Button theme={props.theme[2]} text="Файлы" style={String("ifile")} onclick={()=>{navigate('/files')}}/>}
                  {<box.Button theme={props.theme[2]} text="Расписание" style={String("ischedule")} onclick={()=>{navigate('/schedule')}}/>} 
                  {<box.Button theme={props.theme[2]} text="Устройства" style={String("idevice")} onclick={()=>{navigate('/devices')}}/>}   
              </div>
              <div className="navbarchild">
                  {<box.Button theme={props.theme[2]} style={String("ilogout")} text="Выход" onclick={()=>{cookies.remove("admin");navigate("/");}}/>}
              </div>
          </div>   
    ) 
}

var box={Button,Menu,InputField, TextArea,updateThemeList,lightMode, NavBarAdmin,serverIP}
export default box;
