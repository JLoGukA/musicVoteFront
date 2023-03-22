import React from 'react'
import { useState}from 'react';
import themes from './themes';
import Cookies from 'universal-cookie';

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
import idelete from './asset/delete.svg'
import iupload from './asset/upload.svg'

const tinyimage="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const cookies = new Cookies();

var themeList=themes.GetThemeList()

function updateThemeList(){
    themeList=themes.GetThemeList();
    //alert(themeList)
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
    ishutdown:{image:ishutdown},
    idevice:{image:idevice},
    ilightDark:{image:ilightDark},
    ifile:{image:ifile},
    idelete:{image:idelete},
    iupload:{image:iupload},

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
                    <div style={{'height':'10px'}}></div>
                    <text className='itext'>{(props.text) ? props.text:" "}</text>
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
            <Button style={String("ipalette")} menu={show}/>
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
            type={props.type!==undefined ? props.type:"text"} value={inputText} 
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
    if(cookies.get("themeLight")&&cookies.get("themeCol")){
        if(cookies.get("themeLight")==="0")cookies.set("themeLight",1)
        else cookies.set("themeLight",0)
    }
    else {
        cookies.set("themeLight",1);
        cookies.set("themeCol",2);
    }
}

var box={Button,Menu,InputField, TextArea,updateThemeList,lightMode}
export default box;
