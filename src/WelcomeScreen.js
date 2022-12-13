import React from 'react'
import { useState} from 'react';
import axios from 'axios';

import './css/NavBar.css'
import './css/NavButton.css'

import inote from './asset/note.svg'
import ibmstu from './asset/logo-bmstu.svg'
import ischedule from './asset/schedule.svg'
import igear from './asset/gear.png'
import error from './audio/error.mp3'

const dict={
    "inote":{image:inote},
    "ibmstu":{image:ibmstu},
    "ischedule":{image:ischedule},
    "igear":{image:igear},
    "ispace":{image:null}
}

function Button(props){

    const onclick = async () =>{
        if(props.style==="igear"||props.style==="ispace"){
            let aud = new Audio(error)
            aud.play()
            await axios.get("http://localhost:3005/get/winner")
        }
        if(props.link!==null){document.location.href=props.link;}
    }
 
    return(
        <div class={props.style} onClick={()=>{onclick()}}>
            <img class="btnImgStyle" src={dict[props.style].image}></img>
            <text>{props.text}</text>
        </div>
    );
}

function NavBar(props){
    if(props.mobile===true){
        return(
        <div>
            <ul className="navbar_mobile">
                <div class="navbarchild">
                    {<Button link="https://mf.bmstu.ru/" style="ibmstu"/>}
                    {<Button link="http://rasp.msfu.ru/" style="ischedule"/>}
                </div>
                <div class="navbarchild">
                    {<Button style="igear"/>}
                   {<Button link="http://rasp.msfu.ru/" style="inote"/>}
               </div>
            </ul>  
        </div> 
        )  
    } 
    else{
        return(
                <div className="navbar">
                    <div className="navbarchild">
                        {<Button link="https://mf.bmstu.ru/" text="МФ МГТУ" style="ibmstu"/>}
                        {<Button link="http://rasp.msfu.ru/" text="Расписание" style="ischedule"/>}    
                    </div>
                    {<Button style="ispace"/>} 
                    <div className="navbarchild">
                        {<Button style="igear"/>}
                        {<Button link="http://rasp.msfu.ru/" text="Предложить музыку" style="inote"/>}
                    </div>
                </div>   
        ) 
    }
}

function ElemCont(props){

    const [elemVotes]=useState([])
    const [selected, setSelected]=useState([])
    const [active, setActive]=useState(false)
    const numbers = [];
    
    for(let i=0;i<props.songsAmount;i++){
        numbers[i]=i;
        let y = parseInt(props.votes[i],10)
        elemVotes[i]=y;
    }
    
    const update =async (num) =>{

        elemVotes[num]++
        let h = elemVotes[num]
        selected[num]=true
        for(let i=0;i<props.songsAmount;i++){
            if(i!==num)selected[i]=false
        }

        props.updateRequest(num,h)
        setActive(true)

    }

    let map = numbers.map(
        (number)=> 
            <div className={(selected[number]===true) ? 'elem select' : 'elem nonselect'} onClick={() => {if(active!==true)update(number)}}>
                <span className={(active!==false&&elemVotes[number]!==0) ? 'progress-bar anim' : 'progress-bar'} style={{ 'width': ((props.votesAmount!==0) ? (elemVotes[number] / props.votesAmount * 100).toFixed(2) : '0') + "%"}} />
                <div className="content">{(active===true) ? ((props.votesAmount!==0) ? props.music[number]+ " - " +(elemVotes[number] / props.votesAmount * 100).toFixed(2) : '0') + "%" : props.music[number]}</div>
            </div>
    )
    
    return(
        <div className="poll">
            <h1 class="pollheader">What music will be playing on next break?</h1>
            {map}
        </div>
    )
    
}

const box={NavBar,ElemCont};

export default box;
