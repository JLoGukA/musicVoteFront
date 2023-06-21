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

function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}

function ScheduleTable(){
    const navigate = useNavigate()
    const [schedule,setSchedule]=useState([])
    const [buffer,setBuffer]=useState([])

    useEffect(()=>{
      (async () => {
        box.updateThemeList().then(await getTableData())
      })();
    },[])
    

    const handleChange=async(update,id,cell,value,addvalue)=>{
      if(value==""||value<-1) return;
      let encval=encodeURI(value),enccell=encodeURI(cell),
      encaddval=encodeURI(addvalue)
      axios.get(box.serverIP+"/polls/set",{headers:{
          "id":id,
          "cell":enccell,
          "val":encval,
          "addval":encaddval
      }}).then(async(res)=>{
        if(res.data==="OK"&&update){
          await getTableData()
        }
      }).catch((err)=>{})
      
    }

    const addRow=async(mode,poll_id)=>{
      axios.get(box.serverIP+"/polls/add",{headers:{
        "mode":mode,
        "poll_id":poll_id
      }}).then((res)=>{
        getTableData()
      })
    }
    const delRow=async(mode,poll_id,optional)=>{
      axios.get(box.serverIP+"/polls/del",{headers:{
        "mode":mode,
        "poll_id":poll_id,
        "optional":optional
      }}).then((res)=>{
        getTableData()
      })
    }
    
    const getTableData=async()=>{
      await axios({
        url:box.serverIP+"/polls/info",
        method:'GET',
      }).then((res)=>{
        let iter1,iter2
        let files={}
        
        for(let i=0; i<res.data.rowsFile.length; i++){
            iter2=res.data.rowsFile[i].poll_id
            if(iter1!==iter2){
                iter1=iter2
                files[iter1]=[]
            }
            files[iter2].push(
              <option value={res.data.rowsFile[i].file}>
                {res.data.rowsFile[i].file}
              </option>
            )
        }

        let table=[]
        table.push([])
        table[0]=[
          <th><box.Button style={String("iadd")} onclick={async()=>{await addRow(1)}}/></th>,
          <th>Номер голосования</th>,
          <th>Название</th>,
          <th>Дата начала</th>,
          <th>Дата окончания</th>,
          <th>Вариант выбора</th>,
          <th>Голоса</th>,
          <th>Файл</th>,
          <th>Устройство</th>
          
          
        ]
        let pid1=undefined,pid3=undefined,pid2,pid4
        let pid12,pid34,header=0,variant=0,fileid=0
        for(let i=0;i<res.data.rows.length;i++){
          pid2=res.data.rows[i].poll_id
          pid4=res.data.rows[i].infoid
          table.push([])
          if(pid2===pid1){
            header=0
            fileid=i
            pid12=[
              <td></td>,
              <td id={"id"+i} className='schtable'>
                <input type="text" defaultValue={res.data.rows[i].poll_id} readOnly/>
              </td>,
              <td></td>,
              <td></td>,
              <td><p id={"filed"+i} hidden/></td>
            ]
          }
          else{
            pid1=pid2
            header=1
            pid12=[
              <td><box.Button style={String("idiscard")} onclick={async()=>{await delRow(1,res.data.rows[i].poll_id)}}/></td>,
              <td className='schtable'>
                <input id={"id"+i} type="number" defaultValue={res.data.rows[i].poll_id} onChange={async()=>{if(document.getElementById("id"+i).value!="")await handleChange(1,res.data.rows[i].poll_id,0,document.getElementById("id"+i).value)}}/>
              </td>,
              <td>
                <input id={"name"+i} type="text" defaultValue={res.data.rows[i].poll_name} onChange={async()=>{await handleChange(0,res.data.rows[i].poll_id,1,document.getElementById("name"+i).value)}}/>
              </td>,
              <td>
                <input id={"end"+i} type="datetime-local" defaultValue={res.data.rows[i].date_begin.slice(0,16)} onChange={async()=>{await handleChange(0,res.data.rows[i].poll_id,2,document.getElementById("end"+i).value)}}/>
              </td>,
              <td>
                <input id={"beg"+i} type="datetime-local" defaultValue={res.data.rows[i].date_end.slice(0,16)} onChange={async()=>{await handleChange(0,res.data.rows[i].poll_id,3,document.getElementById("beg"+i).value)}}/>
              </td>
            ]
          }
          if(pid3===pid4){
            variant=0
            pid34 = [
              <td></td>,
              <td></td>,
              <td></td>
            ]
          }
          else{
            pid3=pid4
            variant=1
            pid34 = [
              <td>
                <textarea id={"text"+i} placeholder={res.data.rows[i].row_name} defaultValue={res.data.rows[i].row_name} onChange={async()=>{await handleChange(0,res.data.rows[i].infoid,4,document.getElementById("text"+i).value)}}/>
              </td>,
              <td>
                <input 
                  type="number" 
                  id={"num"+i} 
                  defaultValue={res.data.rows[i].votes}
                  onChange={async()=>{await handleChange(0,res.data.rows[i].infoid,5,document.getElementById("num"+i).value)}}
                />
              </td>,
              <td>
                <select 
                  style={{'margin':'1em'}}
                  id={"file"+i}
                  name="file"
                  onChange={async()=>{await handleChange(0,res.data.rows[i].infoid,6,document.getElementById("file"+i).value)}}
                >
                  <option value={"-2"} selected>Выбран: {res.data.rows[i].file}</option>
                  <option value={"--"}>--</option>
                  
                  {files[res.data.rows[i].poll_id]}
                </select>
                
              </td>
              
              
            ]
          }
          table[i+1].push(
            pid12,
            pid34,
            <td>
              
              <input 
                type="number" 
                id={"dev"+i} 
                defaultValue={res.data.rows[i].device_id}
                
                onChange={async()=>{await handleChange(0,res.data.rows[i].devid,7,document.getElementById("dev"+i).value,document.getElementById("filed"+fileid).value)}}
              />
            </td>,
            (variant) ?
            <td>
              <box.Button style={String("ialignnot")} onclick={async()=>{await delRow(2,res.data.rows[i].poll_id,res.data.rows[i].row_name)}}/>
              <box.Button style={String("idevicenot")} onclick={async()=>{await delRow(3,res.data.rows[i].poll_id,res.data.rows[i].devid)}}/>
            </td>:
            (!variant&&!header) ? 
            <td><box.Button style={String("idevicenot")} onclick={async()=>{await delRow(3,res.data.rows[i].poll_id,res.data.rows[i].devid)}}/></td>:
            <></>,
            header? 
              
              <td>
                <box.Button style={String("ialign")} onclick={async ()=>{await addRow(2,res.data.rows[i].poll_id)}}/>
                <box.Button style={String("idevicesmall")} onclick={async()=>{await addRow(3,res.data.rows[i].poll_id)}}/>
              </td>
            
           :<></>,
            
            
          )
        }
        for(let i=0; i<table.length;i++){
          table[i]=
          <tr className='schtable'>
            {table[i]}
            
          </tr>
        }
        setSchedule(<table className={'schtable '+theme[8]}>{table}</table>)
      }).then(setSchedule(<table className={'schtable '+theme[8]}>{buffer}</table>))
    }

    return(
       schedule
    )

}

function VoteSettings(){
    
  const navigate = useNavigate()
  const [update,setUpdate]=useState(0)
  theme = useContext(box.ThemeContext)
  if(cookies.get("CookiesAllowed")===undefined||cookies.get("admin")===undefined){navigate("/");}
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

export default VoteSettings;

  