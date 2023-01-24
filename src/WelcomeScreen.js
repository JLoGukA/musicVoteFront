import React from 'react'
import { useState} from 'react';
import axios from 'axios';

import './css/NavBar.css'
import './css/NavButton.css'

import ispace from './asset/space.png'
import inote from './asset/note.svg'
import ibmstu from './asset/logo-bmstu.svg'
import ischedule from './asset/schedule.svg'
import igear from './asset/gear.png'
import error from './audio/error.mp3'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const dict={
    inote:{image:inote},
    ibmstu:{image:ibmstu},
    ischedule:{image:ischedule},
    igear:{image:igear},
    ispace:{image:ispace},
    itext:{image:""}
}


function Button(props){

    const onclick = async () =>{
        if(props.style==="igear"){
            let aud = new Audio(error)
            aud.play()

            cookies.remove("VoteAccepted")
            //await axios.get("http://localhost:3005/get/winner")
        }
        else if(props.text==="Да"){
            props.allowCookies(1)
        }
        if(props.link!==null){document.location.href=props.link;}
    }
 
    return(
        <div class={props.style} onClick={()=>{onclick()}}>
            <img class="btnImgStyle" src={dict[props.style].image} alt={""}></img>
            <text>{props.text}</text>
        </div>
    );
}

function NavBar(props){
    if(props.mobile===true){
        return(
        <div>
            <div className="navbar_mobile">
                
                {<Button link="https://mf.bmstu.ru/" style={String("ibmstu")}/>}
                {<Button link="http://rasp.msfu.ru/" style={String("ischedule")}/>}
                
                {<Button style={String("igear")}/>}
                {<Button link="http://rasp.msfu.ru/" style={String("inote")}/>}
                
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
        if(cookies.get("VoteAccepted")){
            alert("Вы уже проголосовали!")
            return;
        }
        elemVotes[num]++
        let h = elemVotes[num]
        selected[num]=true
        for(let i=0;i<props.songsAmount;i++){
            if(i!==num)selected[i]=false
        }

        props.updateRequest(num,h)
        cookies.set("VoteAccepted",props.music[num])
        setActive(true)
        
    }

    

    let map = numbers.map(
        (number)=> 
            <div className={(selected[number]===true) ? 'elem select' : 'elem nonselect'} onClick={() => {if(active!==true)update(number)}}>
                <span className={(active!==false&&elemVotes[number]!==0) ? 'progress-bar anim' : 'progress-bar'} style={{ 'width': ((props.votesAmount!==0) ? (elemVotes[number] / props.votesAmount * 100).toFixed(2) : '0') + "%"}} />
                <div className="content">{(active===true) ? ((props.votesAmount!==0) ? props.music[number]+ " - " +(elemVotes[number] / props.votesAmount * 100).toFixed(2) : '0') + "%" : props.music[number]}</div>
            </div>
    )
    
    if(props.cookiesAllow===0){
        
        return(
            <div className="pollCookies">
                <h1 class="pollheader">Этот сайт использует Cookies. Разрешить их создание и хранение?</h1>
                
                
                <div className="pollCookiesRow">
                    
                    <div>{<Button link="https://mf.bmstu.ru/" text="Нет" style={String("itext")}/>}</div>
                    {<Button text="" style={String("ispace")}/>}
                    <div>{<Button text="Да" style={String("itext")} allowCookies={props.allowCookies}/>}</div>

                    
                </div>
                <div className="pollCookiesRow">
                    
                </div>
            </div>
        )
    }
    else{
        return(
            <div className="poll">
                <h1 class="pollheader">Какая музыка будет играть на следующем перерыве?</h1>
                {map}
            </div>
        )
    }
    
}

const box={NavBar,ElemCont};

export default box;
