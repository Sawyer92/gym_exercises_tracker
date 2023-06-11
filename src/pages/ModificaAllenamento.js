import React,{useState} from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate,useParams } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Icon from '@mui/material/Icon';
import { useEffect } from 'react';
import ExerciseTile from '../components/ExerciseTile';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as costants from '../utils/Constants';

export default function ModificaAllenamento (props) {

  const urlAPI = costants.URL_BE;
const navigate = useNavigate();


const params = useParams();
const idAllenamento = parseInt(params.idAllenamento.replace(/_/g, ''));
  
const [arrayResult, setArrayResult] = useState([]);
const [arrayResultZone, setArrayResultZone] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [arrayZoneToDisplay, setArrayZoneToDisplay] = useState([]);
const [nuovoAllenamento , setNuovoAllenamento] = useState ({idUtente:'', nomeScheda: '',nomeAllenamento: '', listaEsercizi:[]});
const [schedaInputState, setSchedaInputState] = useState("");
const [allenamentoInputState, setAllenamentoInputState] = useState("");
const [checkPassedData, setCheckPassedData] = useState(false);
const [modificaAllenamento, setModificaAllenamento] = useState(false);
const [toRefresh, setToRefresh] = useState(false);
const [aggiungiAltriEsercizi, setAggiungiAltriEsercizi] = useState(false);
const [isLoadingZone, setIsLoadingZone] = useState(false);

function getAllenamento () {
    console.log("Effettuo la chiamata per idAllenamento:", idAllenamento);
    let urlToCall = urlAPI+'getAllenamentoPerId?idAllenamento='+idAllenamento;
    fetch(urlToCall).then((response)=> response.json())
    .then((data)=>{
      console.log("Risultato fetch: ", data);
      setArrayResult(data);     
      setIsLoading(false);
    }).catch(function(error){
      console.log("Errore retrieving data", error);
    });
  }


function getEserciziDaMostrare () {
  let urlToCall = urlAPI+'/getAllEserciziPerAllZone';
  fetch(urlToCall).then((response)=> response.json())
  .then((data)=>{
    setArrayResult(data);     
    setIsLoading(false);
  }).catch(function(error){
    console.log("Errore retrieving Zone data", error);
  });
}

useEffect(()=>{
  getAllenamento();
  setToRefresh(false);
  if(aggiungiAltriEsercizi){
    loadZone();
    impostaDisplayZone();
  }
},[isLoading, modificaAllenamento, toRefresh, aggiungiAltriEsercizi , isLoadingZone])

function loadZone () {
  let urlToCall = urlAPI+'/getAllEserciziPerAllZone';
  fetch(urlToCall).then((response)=> response.json())
  .then((data)=>{
    arrayResultZone(data);     
    setIsLoadingZone(false);
  }).catch(function(error){
    console.log("Errore retrieving Zone data", error);
  });
}

function impostaDisplayZone () {
  let tmpArr  = [];
    for(let i = 1; i<=arrayResultZone.length; i++ ){
    tmpArr.push(false);
    setArrayZoneToDisplay(tmpArr);
    }
}

async function updateDisplayZone(id){
  let idPosition = id-1;
  let tmp = arrayZoneToDisplay.slice();
  tmp[idPosition] = !tmp[idPosition];    
  setArrayZoneToDisplay(tmp);
}

 
function addExcerciseToList(esercizioPassato){
let arrayToPush = nuovoAllenamento.listaEsercizi.slice();
let tmp = []; 
if(arrayToPush === undefined || arrayToPush.length===0){
  //array vuoto, aggiungo elem
  arrayToPush.push(esercizioPassato);
}else if(arrayToPush.filter(es => es.id_esercizio===esercizioPassato.id_esercizio).length>0){
    for(let i=0; i<arrayToPush.length; i++){
      if(arrayToPush[i].id_esercizio!==esercizioPassato.id_esercizio){
        tmp.push(arrayToPush[i]);
      }
    }
    arrayToPush =tmp;
  }else {
    arrayToPush.push(esercizioPassato);
  } 
const arrayEserciziToPush = arrayToPush;
setNuovoAllenamento({listaEsercizi: arrayEserciziToPush,...nuovoAllenamento, });      
}


function addUserId(){
const idUt = 2;
const titoloScheda = schedaInputState;
const titoloAllenamento = allenamentoInputState;
const esercizi = nuovoAllenamento.listaEsercizi;
const allenamento = {
  idUtente: idUt, 
  nomeScheda: titoloScheda, 
  nomeAllenamento: titoloAllenamento, 
  listaEsercizi: esercizi
}
setNuovoAllenamento(allenamento)
}

function checkData(nuovoAllenamento){
if((nuovoAllenamento.nomeAllenamento !== undefined || nuovoAllenamento.nomeAllenamento!== null || nuovoAllenamento.nomeAllenamento!=='' ) 
&& (nuovoAllenamento.nomeScheda !== undefined || nuovoAllenamento.nomeScheda!== null || nuovoAllenamento.nomeScheda!=='' ) 
&& (nuovoAllenamento.listaEsercizi!== undefined || nuovoAllenamento.listaEsercizi!==null ||nuovoAllenamento.listaEsercizi!==[] || nuovoAllenamento.listaEsercizi.length()>0)){
  //conformità OK posso eseguire la POST
  setCheckPassedData(true);
  console.log("Validità OK");
} 
}

const dispalyZone = () =>{
return arrayResultZone.map((elem) =>{
  return <div>
    <div>
      <h1 className="text-2xl underline-offset-4 underline m-4 flex" >
        {elem.nomeZona}
        <button className="group flex w-0 h-0">
          <span className={arrayZoneToDisplay[elem.id-1] ? "rotate-90 duration-300" : 'group-hover:rotate-90 duration-300'} 
          onClick={()=>{updateDisplayZone(elem.id)}}>
          <ArrowForwardIcon sx={{width:25, height:25}} className="ml-2"/>
        </span>
        </button>
      </h1>
    </div>
    <div style={{flexDirection: "row",display:"flex",}}>
      {elem.eserciziList!== null && elem.eserciziList.length > 0 && arrayZoneToDisplay[elem.id-1] ?  
     elem.eserciziList.map((es)=>{ 
      return <div style={{flexDirection: "row",display:"flex",}} onClick={()=>{addExcerciseToList(es)}}>
            <ExerciseTile onClick={()=>{}} key={es.id_esercizio} title={es.nomeEsercizio} esercizio={es} />
          </div>
     })
    : <div></div>}
    </div> 
    </div>
});
}

function eliminaEsercizio (allenamentoId, esercizioId) {
  console.log("Devo eliminare esercizio con id: ", esercizioId);
  let urlToCall = urlAPI+'deleteEsercizioFromAllenamento?idAllenamento='+allenamentoId+'&idEsercizio='+esercizioId;
  const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    };
  fetch(urlToCall,requestOptions).then((response)=> {
    response.json();
    setToRefresh(true);
  })
  .catch(function(error){
      console.log("Errore in eliminazione esercizio", error);
  }); 
}

const displayEserciziTrovati = ()=>{
  return arrayResult.listaEsercizi.map((esercizio, index) => {
    if(modificaAllenamento){
      return (
        <div className='flex flex-row items-center align-top w-64 h-20 bg-white border-2 rounded mr-2 ml-2 hover:border-pink-600 hover:border-4 text-black'>
          <Icon style={{width:'70px', height: '70px', paddingTop: '12px', paddingRight: '15px',}} onClick={() => {eliminaEsercizio(arrayResult.idAllenamento, esercizio.id_esercizio)}}>
              <DeleteIcon className="hover:fill-red-600" />
          </Icon>
          <h1 className='text-xl font-bold'>{esercizio.nomeEsercizio}</h1>          
        </div>
      );
    }else{
    return <div>
      <ExerciseTile title={esercizio.nomeEsercizio}/>
    </div>
    }
  });

}

const caricaContenuto =()=>{
  let allenamentoTrovato =  arrayResult;
  console.log("Dati ottenuti:", allenamentoTrovato);
  if(isLoading){
    return <div><LoadingSpinner/></div> 
  }else{
    return (
      <div  style={{display:'flex', flexDirection: "column" }}>
          <div style={{display:'flex', flexDirection: "row" , paddingTop:'10px', paddingLeft:'10px', alignItems:'center'}}>
            <h1 className="text-4xl px-5">Modifica allenamento</h1>
            <h1>{allenamentoTrovato.nomeAllenamento}</h1>
          </div>
          <div className="m-4 flex flex-row align-middle">
            <h2>Elenco esercizi presenti nell'allenamento:</h2>
            <Icon style={{width:'70px', height: '70px', paddingTop: '12px', paddingRight: '15px'}} onClick={()=>{setModificaAllenamento(!modificaAllenamento)}}>
              <EditIcon/>
            </Icon>
          </div>
          <div className='flex-row m-4 px-10 grid grid-cols-4 gap-4 '>
            {displayEserciziTrovati()}
          </div>
      </div> 
    );
  }
}

  return (
    <div className="w-full h-full">
      {caricaContenuto()}
      <div className="m-4 flex flex-row align-middle">
        <h2>Seleziona gli esercizi da aggiungere dall'elenco</h2>
        { aggiungiAltriEsercizi ? <ExpandLessIcon onClick={()=>{setAggiungiAltriEsercizi(!aggiungiAltriEsercizi)}}/> : <ExpandMoreIcon onClick={()=>{setAggiungiAltriEsercizi(!aggiungiAltriEsercizi)}}/>}
      </div>
      <div className="w-full h-10"/> 
      {!isLoading && aggiungiAltriEsercizi ? 
          <div style={{flexDirection: "column",  marginLeft:'10px', marginTop:'20px'}}>
              {dispalyZone()}
          </div> : null
      }
    </div>
    
  );

}

