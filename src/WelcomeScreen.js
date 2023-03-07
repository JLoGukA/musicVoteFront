import React from 'react'
import { useState} from 'react';
import themes from './themes';

import './css/NavBar.css'
import './css/NavButton.css'
import './css/Poll.css'
import './css/themes.css'

import ispace from './asset/space.png'
import inote from './asset/note.svg'
import ibmstu from './asset/logo-bmstu.svg'
import ischedule from './asset/schedule.svg'
import igear from './asset/gear.svg'
//import error from './audio/error.mp3'
import isun from './asset/sun.svg'
import imoon from './asset/moon.svg'

import Cookies from 'universal-cookie';

const tinyimage="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const cookies = new Cookies();
var elementsNum=6;

var themeList=themes.getThemeList(elementsNum)

function updateThemeList(){
    themeList=themes.getThemeList(elementsNum);
}

// const Theme = {
//     palette: {
//       primary: {
//         //page: 0, navbar: 1, button: 2, poll:3, colorpoll: 4
//         0: "#000000"
        
//       },
//       secondary: {
//         0: "#FFFFFF"
//       }
//     }
// };



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
    imoon:{image:imoon},
    isun:{image:isun},

    inoteM:{image:inote},
    ibmstuM:{image:ibmstu},
    ischeduleM:{image:ischedule},
    igearM:{image:igear},
}

function Button(props){
    var btheme=themeList[2]

    const onclick = async () =>{
        if(props.style==="igear"){
            //let aud = new Audio(error)
            //aud.play()
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
                <div class={"btnAll "+props.style+" "+btheme} onClick={()=>{onclick()}}>
                    <img src={(dict[props.style]!==undefined) ? dict[props.style].image:tinyimage} alt={""}></img>
                </div>
            </div>
        )
    }
    else{
        return(
            <div className={"Back "+ btheme+"Back"}>
                <div class={"btnAll "+props.style+" "+btheme} onClick={()=>{onclick()}}>
                    <img src={(dict[props.style]!==undefined) ? dict[props.style].image:tinyimage} alt={""}></img>
                    <div style={{'height':'10px'}}></div>
                    <text>{props.text}</text>
                </div>
            </div>
        )
    }
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
                    {<Button style={String("ispace")}/>} 
                    <div className="navbarchild">
                        {<Button style={String("igear")}/>}
                        {<Button link="http://rasp.msfu.ru/" text="Предложить музыку" style={String("inote")}/>}
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

function cookiesPrompt(props){
    const cookiesEnable =()=>{
        props.allowCookies(1)
        props.makeUpdate(-1)
    }
    return(
        <div className={"pollCookies " +themeList[3]} >
            <h1 class="pollHeader">Этот сайт использует Cookies. Разрешить их создание и хранение?</h1>
            <div className="pollCookiesRow">
                <Button link="https://mf.bmstu.ru/" text="Нет" style={String("itext")}/>
                <Button text="" style={String("ispace")}/>
                <Button text="Да" style={String("itext")} onclick={cookiesEnable}/>
            </div>
        </div>
    )
}

function themePoll(props){
    props.update(themeList[0])
    return(
        <div class='themePoll'>
            <Button id ="isun" style="isun" onclick={ ()=>{cookies.set("themeColor",2);cookies.set("themeLight",1);updateThemeList(); props.update(themeList[0])}}/>
            <Button style="imoon" onclick={()=>{cookies.set("themeColor",2);cookies.set("themeLight",0);updateThemeList(); props.update(themeList[0])}}/>
        </div>
    )
}


const box={NavBar,Poll,Button,cookiesPrompt, themePoll};

export default box;
