import React from 'react'
import { useState} from 'react';

import './css/NavBar.css'
import './css/NavButton.css'
import './css/Poll.css'

import ispace from './asset/space.png'
import inote from './asset/note.svg'
import ibmstu from './asset/logo-bmstu.svg'
import ischedule from './asset/schedule.svg'
import igear from './asset/gear.png'
//import error from './audio/error.mp3'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const dict={
    inote:{image:inote},
    ibmstu:{image:ibmstu},
    ischedule:{image:ischedule},
    igear:{image:igear},
    ispace:{image:ispace},
    itext:{image:""},

    inoteM:{image:inote},
    ibmstuM:{image:ibmstu},
    ischeduleM:{image:ischedule},
    igearM:{image:igear},
}

function Button(props){

    const onclick = async () =>{
        if(props.style==="igear"){
            //let aud = new Audio(error)
            //aud.play()

            cookies.remove("VoteAccepted")
        }
        if(props.link!==null){document.location.href=props.link;}
    }
    if(props.mobile){
        return(
            <div class={props.style} onClick={()=>{onclick()}}>
                <img class="btnMobileImgStyle" src={dict[props.style].image} alt={""}></img>
                <text>{props.text}</text>
            </div>
        )
    }
    else{
        return(
            <div class={props.style} onClick={()=>{onclick()}}>
                <img class="btnImgStyle" src={dict[props.style].image} alt={""}></img>
                <text>{props.text}</text>
            </div>
        )
    }
}

function NavBar(props){
    if(props.mobile===true){
        return(
        <div>
            <div className="navbar_mobile">
                
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
                <div className="navbar">
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
            elements[i]=(<div className='pollElemContainer'>
                            <div className='pollElem notSelected' onClick={() => {update(i,y)}}>
                                <h2 className="pollElemHeader" style={{'color':'#e0d5be'}}>{props.musicData[0][i]}</h2>
                            </div>
                        </div>)
        }
        else{
            elements[i]=(<div className='pollElemContainer'>
                            <h2 className="pollElemHeader" style={{'color':'#e0d5be'}}>{props.musicData[0][i] + " - "+(y / props.musicData[3] * 100).toFixed(2) + "%"}</h2>
                            <div className={(voted===i) ? 'pollElem selected' : 'pollElem notSelected'}>
                                <div className={(y!==0) ? 'progress-bar anim':""} style={
                                    { 'width': ((y / props.musicData[3] * 100).toFixed(2)) + "%"}} 
                                />
                            </div>
                        </div>)
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
        <div className="poll">
            <h1 class="pollHeader">Какая музыка будет играть на следующем перерыве?</h1>
            {elements}
            
        </div>
    )
    
}

function cookiesPrompt(props){
    const cookiesEnable =()=>{
        props.allowCookies(1)
        document.location.href="/"
    }
    return(
        <div className="pollCookies" >
            <h1 class="pollHeader">Этот сайт использует Cookies. Разрешить их создание и хранение?</h1>
            <div className="pollCookiesRow" >
                <div>{<Button link="https://mf.bmstu.ru/" text="Нет" style={String("itext")}/>}</div>
                {<Button text="" style={String("ispace")}/>}
                <div onClick={()=>{cookiesEnable()}}>{<Button text="Да" style={String("itext")}/>}</div>
            </div>
        </div>
    )
}


const box={NavBar,Poll,Button,cookiesPrompt};

export default box;
