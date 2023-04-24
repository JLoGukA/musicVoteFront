import { React, useState, useEffect, useRef, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Cookies from 'universal-cookie';

import '../css/App.css';
import '../css/FileTable.css'
import '../css/ScheduleTable.css'

import box from "../Elements"

const cookies = new Cookies();
const ThemeContext = createContext(box.updateThemeList())

function ScheduleTable(){
    const navigate = useNavigate()
    const theme = useContext(ThemeContext)
    const [schedule,setSchedule]=useState({})
    const [tableData,setTableData]=useState({})
    const [scheduleRaw, setScheduleRaw]=useState({})

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
            for(let i=0; i<res.data.length&&i<1;i++){//Формирование строки с заголовками в таблице
                elements.push([])
                for(let j=0; j<res.data[i].length; j++){
                    elements[i].push(<th>{res.data[i][j]}</th>)
                }
            }
            for(let i=1; i<res.data.length;i++){//Формирование каждой строки таблицы кроме заголовков
                elements.push([])
                for(let j=0; j<res.data[i].length; j++){
                    let el=res.data[i][j]
                    
                    let cid="cell"+i+j
                    if(j===2){// 2 - j место даты в массиве res.data[i][j]
                        elements[i].push(
                            <td>
                                <input id={cid} type={"datetime-local"}
                                placeholder={el} 
                                defaultValue={el.slice(0,16)}
                                onKeyDown={(e)=>{if(e.key==="Enter")handleKey(e,res.data[i][0],res.data[0][j],document.getElementById(cid).value)}}/>
                            </td>
                        )
                    }
                    else if(j===3){// 3 - j Место файлов
                        elements[i].push(
                            <td style={{'display':'flex','flex-direction':'column'}}>
                                {/* <text>Выбран: {res.data[i][j]}</text> */}
                                <select 
                                style={{'margin':'1em'}}
                                id={"wavMenu"+i+j}
                                name="file"
                                onChange={()=>{
                                    let e={};
                                    e.key="sel";
                                    handleKey(e,res.data[i][0],res.data[0][j],document.getElementById("wavMenu"+i+j).value)
                                }}>
                                    <option value={-1}>Выбран: {res.data[i][j]}</option>
                                    <option value={-1}>--</option>
                                    {wav[res.data[i][1]]}
                                </select>
                            </td>
                        )
                    }
                    else{
                        elements[i].push(
                            <td>
                                <textarea id={cid} 
                                placeholder={el} 
                                defaultValue={el}
                                onKeyDown={(e)=>{if(e.key==="Enter")handleKey(e,res.data[i][0],res.data[0][j],document.getElementById(cid).value)}}/>
                            </td>
                        )
                    }  
                }
            }
            
            elements[0]= //оборачивание в <tr> заголовков
            <tr>
                {elements[0]}
                <box.Button 
                    theme={theme[2]} 
                    style="iadd" 
                    onclick={()=>{let e={};e.key="add" ;handleKey(e)}}
                />
            </tr>

            for(let i=1; i<res.data.length; i++){ //оборачивание в <tr> строк кроме заголовков
                elements[i]=
                <tr>
                    {elements[i]}
                    <box.Button 
                        theme={theme[2]} 
                        style="idelete" 
                        onclick={()=>{let e={};e.key="del";handleKey(e,res.data[i][0])}}
                    />
                </tr>
            }
            setSchedule(elements)
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
                    alert("Ошибка в измененных ячейках таблицы")
                }
            })
        }
        
    }

    return(
        <table>
            {
                Object.entries(schedule).map(([key,value])=>(
                    <>{value}</>
                ))
            }
        </table>
    )

}


function Schedule(){
    
  const navigate = useNavigate()
  if(cookies.get("CookiesAllowed")===undefined||cookies.get("admin")===undefined){navigate("/")}

  const [update,doUpdate]=useState(0)
  const [theme,setTheme]=useState({})

  document.body.style="transition:all 0.2s; background:"+theme[0]+";"

  useEffect(() => {
    doUpdate(Math.random())
  },[])

  useEffect(()=>{
    setTheme(box.updateThemeList())
  },[update])

  let elem,navbar
  
  navbar = <ThemeContext.Provider value={theme}><box.NavBarAdmin theme={theme}/></ThemeContext.Provider>
  elem=<ThemeContext.Provider value={theme}><ScheduleTable/></ThemeContext.Provider>

  return (
      <div className="mainLevel">
        <div className='topLevel'>
          {<box.Button  style={String("ispace")}/>}
          {<box.Menu emplace={1} update={doUpdate}/>}
          {<box.Button theme={theme[2]} style={String("ilightDark")} onclick={()=>{box.lightMode();doUpdate(Math.random())}}/>}
          {<box.Button theme={theme[2]} style={String("iterminal")} onclick={()=>{navigate('/')}} />}
        </div>
        {navbar}
        <div className='spaceElement'></div>
        {elem}
      </div>
  )
}

export default Schedule;

  