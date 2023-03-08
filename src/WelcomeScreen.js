import React from 'react'
import { useState} from 'react';
import themes from './themes';
import styled from 'styled-components';

import './css/NavBar.css'
import './css/NavButton.css'
import './css/Poll.css'
import './css/themes.css'
import './css/LogInBox.css'


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

import Cookies from 'universal-cookie';

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
        if(props.onclick!==undefined)props.onclick(Math.random()/1*10);
        
        if(props.link!==undefined)document.location.href=props.link;
    }
    if(props.mobile){
        return(
            <div className={"Back "+ btheme+"Back"}>
                <div className={props.menu===1 ? "btnAll "+props.style:"btnAll "+props.style+" "+btheme} onClick={()=>{onclick()}}>
                    <img src={(dict[props.style]!==undefined) ? dict[props.style].image:tinyimage} alt={""}></img>
                </div>
            </div>
        )
    }
    else{

        return(
            <div className={"Back "+ btheme+"Back"}>
                <div className={props.menu===1 ? "btnAll "+props.style:"btnAll "+props.style+" "+btheme} onClick={()=>{onclick()}}>
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

    const setVisible = (props)=>{
        setShow(props)
        props.update()
    }
    const onclick=(num)=>{
        if(num===0)cookies.set("themeColor",3)
        else if(num===1)cookies.set("themeColor",4)
        else if(num===2)cookies.set("themeColor",2)
        props.update()
    }
    var menuList =[
        <div onClick={()=>{onclick(0)}}><Button style="ired" menu={1}/></div>,
                <div onClick={()=>{onclick(1)}}><Button style="igreen" menu={1}/></div>,
                <div onClick={()=>{onclick(2)}}><Button style="iblue" menu={1}/></div>
                ]
    if(props.elems!=undefined){
        menuList=[]
        for(var i=0; i<props.num; i++){
            menuList.push(props.elems[i])
        }
    }
    
    if(show){
        return(
            <div className='menu' onMouseEnter={()=>{setVisible(1)}} onMouseLeave={()=>{setVisible(0)}}>
                <Button style="ipalette" menu={1}/>
                {menuList}
            </div>
        )
    }
    else {
        return(
            <div style={{"z-index":'6'}} onMouseEnter={()=>{setShow(1)}}>
                <Button style="ipalette" ></Button>
            </div>
        )
    }
}

function InputField(props){
    const [inputText, setInputText] = useState("");
    
    const HandleChange = (event) =>{
        setInputText(event.target.value);
    }

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

function LogInBox(props){
    const onKeyEnter=async(e)=>{
        if(e==="Enter"){
            const res = await fetch("http://localhost:3005/user/login", {
                method: "POST",
                headers: {"Content-Type": "application/JSON"},
                body: JSON.stringify({"login":document.getElementById("login").value,"pass":document.getElementById("pass").value})
            }).then((res) => res.json());

            if(res===1){
                props.setAdmin(1);
                props.setLogin(0);
                props.update()
            }
            else alert("Неправильный логин или пароль")
            
        }
    }
    const l=<InputField idx="login" text="Логин"/>
    const p =<InputField idx="pass" text="Пароль" onKey={onKeyEnter} type="password"/>
    return(
        <div className="logInBox">
            {l}
            {p}
            <Button style='itext' text="Войти" onclick={()=>{onKeyEnter("Enter")}}/>
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
                        {<Button text="Все файлы"style="ifile"/>}
                        {<Button text="Расписание аудио" style="ischedule"/>} 
                        {<Button text="Подключенные устройства" style={"idevice"} />}
                        
                    </div>
                    
                    <div className="navbarchild">
                        {<Button style="ishutdown" text="Выход" onclick={()=>{props.setAdmin(0)}}/>}
                    </div>
                    
                </div>   
        ) 
    }
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


export default {NavBar,Poll,Button,CookiesPrompt,Menu, LogInBox,NavBarAdmin,updateThemeList};
