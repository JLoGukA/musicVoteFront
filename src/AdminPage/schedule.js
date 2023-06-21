import { React, useState, useEffect, useRef, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Cookies from 'universal-cookie';

import '../css/App.css';
import '../css/FileTable.css'
import '../css/ScheduleTable.css'

import box from "../Elements"

const cookies = new Cookies();
var theme

function ScheduleTable(){
    const navigate = useNavigate()
    const [schedule,setSchedule]=useState([])
    const [tableData,setTableData]=useState({})

    useEffect(()=>{
        updateTable()
    },[])

    const getTableData=async()=>{
        await axios({
            url:box.serverIP+"/schedule/get",
            method:'GET',
        }).then(async(res)=>{
            let wav=[]

            await axios({//получение информации о том, какие файлы wav,mp3 для каких устройств: id, filename
                url:box.serverIP+"/schedule/getFileInfo",
                method:'GET',
            }).then((res)=>{
                for(let i=0; i<res.data.length;i++){
                    if(wav[res.data[i][0]]===undefined)wav[res.data[i][0]]=[]
                    wav[res.data[i][0]].push(
                        <option value={res.data[i][1]}>
                            {res.data[i][1]}
                        </option>
                    )
                }
                setTableData(wav)

            })
        })
    }

    const updateTable=async()=>{

        await axios({
            url:box.serverIP+"/schedule/get",
            method:'GET',
        }).then(async(res)=>{
            let wav=[]

            await axios({//получение информации о том, какие файлы wav,mp3 для каких устройств: id, filename
                url:box.serverIP+"/schedule/getFileInfo",
                method:'GET',
            }).then((res)=>{
                for(let i=0; i<res.data.length;i++){
                    if(wav[res.data[i][0]]===undefined)wav[res.data[i][0]]=[]
                    wav[res.data[i][0]].push(
                        <option value={res.data[i][1]}>
                            {res.data[i][1]}
                        </option>
                    )
                }
            })

            // res.data[0][0] = "Номер"; res.data[0][1] = "Устройство"; res.data[0][2] = "Дата/Время"; res.data[0][3] = "Файл";
            // res.data[0][4]="Место"; res.data[0][5] = "Комментарий"
            
            let elements=[]
            //Формирование строки с заголовками в таблице
            elements.push([])
            for(let j=0; j<res.data[0].length; j++){
                elements[0].push(<th>{res.data[0][j]}</th>)
            }
            
            for(let i=1; i<res.data.length;i++){//Формирование каждой строки таблицы кроме заголовков
                elements.push([])
                elements[i]=[
                    <td className='schtable'>
                      <input
                      defaultValue={res.data[i][0]} 
                      readOnly
                      />
                    </td>,
  
                    <td className='schtable'>
                    <input 
                      type="number" 
                      id={"cell"+i+"1"} 
                      defaultValue={res.data[i][1]}
                      onChange={(e)=>{e.key="Enter";handleKey(e,res.data[i][0],res.data[0][1],document.getElementById("cell"+i+"1").value)}}
                    />
                    </td>,
  
                    <td className='schtable'>
                      <input id={"cell"+i+"2"} type={"datetime-local"}
                      defaultValue={res.data[i][2].slice(0,16)}
                      onKeyDown={(e)=>{if(e.key==="Enter")handleKey(e,res.data[i][0],res.data[0][2],document.getElementById("cell"+i+"2").value)}}/>
                    </td>,
  
                    <td style={{'display':'flex','flex-direction':'column'}} >
                      <select 
                      style={{'margin':'1em'}}
                      id={"wavMenu"+i+"3"}
                      name="file"
                      onChange={()=>{
                          let e={};
                          e.key="sel";
                          handleKey(e,res.data[i][0],res.data[0][3],document.getElementById("wavMenu"+i+"3").value)
                      }}>
                        <option value={-1}>Выбран: {res.data[i][3]}</option>
                        <option value={-1}>--</option>
                        {wav[res.data[i][1]]}
                      </select>
                    </td>,
  
                    <td className='schtable'>
                      <textarea  id={"cell"+i+"4"} 
                      placeholder={res.data[i][4]} 
                      defaultValue={res.data[i][4]}
                      onChange={(e)=>{e.key="Enter";handleKey(e,res.data[i][0],res.data[0][4],document.getElementById("cell"+i+"4").value)}}
                      />
                    </td>,
  
                    <td className='schtable'>
                      <textarea  id={"cell"+i+"5"} 
                      placeholder={res.data[i][5]} 
                      defaultValue={res.data[i][5]}
                      onChange={(e)=>{e.key="Enter";handleKey(e,res.data[i][0],res.data[0][5],document.getElementById("cell"+i+"5").value)}}
                      />
                    </td>
                  
                ]
            }
            
            elements[0]= //оборачивание в <tr> заголовков
            <tr className='schtable'>
                {elements[0]}
                <box.Button 
                    
                    style="iadd" 
                    onclick={()=>{let e={};e.key="add" ;handleKey(e)}}
                />
            </tr>

            for(let i=1; i<res.data.length; i++){ //оборачивание в <tr> строк кроме заголовков
                elements[i]=
                <tr className='schtable'>
                    {elements[i]}
                    <box.Button 
                        
                        style="idelete" 
                        onclick={()=>{let e={};e.key="del";handleKey(e,res.data[i][0])}}
                    />
                </tr>
            }
            setSchedule(<table className={'schtable '+theme[8]}>{elements}</table>)
        })   
    }

    const handleKey=async (e,line,col,val)=>{
        
        if(e.key){
            if(val==-1)val=""
            let encline = encodeURI(line)
            let enccol = encodeURI(col)
            let encval = encodeURI(val)
            let edit=0
            
            if(e.key==="del")edit=1
            else if(e.key==="add")edit=2
            
            await axios({
                url:box.serverIP+"/schedule/edit",
                method:'GET',
                headers:{
                    'id':encline,
                    'col':enccol,
                    'val':encval,
                    'edit':edit
                }
            }).then ((res)=>{
                if(res.data==="OK"){
                    updateTable()
                }
            }).catch((err)=>{
                if(err.response.status){
                    alert("Ошибка при изменении расписания")
                }
            })
        }
        
    }

    return(
        schedule
    )

}


function Schedule(){
    
  const navigate = useNavigate()
  const [update,setUpdate]=useState(0)
  theme = useContext(box.ThemeContext)
  if(cookies.get("CookiesAllowed")===undefined||cookies.get("admin")===undefined){navigate("/")}
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
  elem=<box.ThemeContext.Provider value={theme}><ScheduleTable/></box.ThemeContext.Provider>

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

export default Schedule;

  