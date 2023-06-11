import React, {useState, useEffect}from "react";
import ExerciseTile from "../components/ExerciseTile";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import lista from './../assets/images/training_list.png';
import * as costants from '../utils/Constants';

export default function CreateNewAllenamento () {

 
  const urlAPI = costants.URL_BE;
  
  const [arrayResult, setArrayResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [arrayZoneToDisplay, setArrayZoneToDisplay] = useState([]);
  const [nuovoAllenamento , setNuovoAllenamento] = useState ({idUtente:'', nomeScheda: '',nomeAllenamento: '', listaEsercizi:[]});
  const [schedaInputState, setSchedaInputState] = useState("");
  const [allenamentoInputState, setAllenamentoInputState] = useState("");
  const [checkPassedData, setCheckPassedData] = useState(false);


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
    getEserciziDaMostrare();
    impostaDisplayZone();
  },[isLoading, ])

  function impostaDisplayZone () {
    let tmpArr  = [];
      for(let i = 1; i<=arrayResult.length; i++ ){
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


function schedaTypedInput(event) {
  const typedTitoloScheda = event.target.value; 
  setSchedaInputState(typedTitoloScheda);
}

function allenamentoTypedInput(event) {
  const typedTitoloAllenamento = event.target.value; 
  setAllenamentoInputState(typedTitoloAllenamento);
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

function creaNuovoAllenamento(){
addUserId();
checkData(nuovoAllenamento)
if(checkPassedData){
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuovoAllenamento)
  };
  let urlToCall = urlAPI+'/creaAllenamento';
  fetch(urlToCall, requestOptions).then(res =>{
    let response = res.json();
    console.log(response);
    console.log("POST Eseguita");
    setCheckPassedData(false);
  }).catch(()=>{
    console.log("Error during POST")
  })  
}else {
  //TODO Generare un alert
  console.log("Verifica i dati inseriti")
}  
}

 const dispalyZone = () =>{
  return arrayResult.map((elem) =>{
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

    return (
        <div className="w-full h-full">
          <div  style={{display:'flex', flexDirection: "column" }}>
            <div style={{display:'flex', flexDirection: "row" , paddingTop:'10px', paddingLeft:'10px', alignItems:'center'}}>
              <img src={lista} width='70px' height='70px'/>
              <h1 className="text-4xl px-5">Pagina creazione allenamento</h1>
              <div className='flex flex-row border-2 rounded-lg px-5 py-2 hover:bg-pink-600' onClick={()=>{creaNuovoAllenamento()}}>
                <button onClick={()=>{}}>Crea Allenamento</button>
              </div>
            </div>
          </div>
          <div style={{paddingTop: '15px',paddingBottom:'5px',paddingLeft: '100px', flexDirection: "row", display:"flex"}}>
              <form >
                  <label style={{paddingRight: '10px', fontSize:'18px', fontWeight:'bold', paddingRight: '15px'}}>
                    Titolo Scheda:
                    <input required type="text" name="schedaInput" 
                      style={{color: 'black', marginLeft:'10px', borderRadius: 3, borderWidth: '0.5'}} 
                      value={schedaInputState} onChange={schedaTypedInput} />
                  </label>
                  <label style={{paddingRight: '10px', fontSize:'18px', fontWeight:'bold',}}>
                    Nome Allenamento:
                    <input type="text" required  
                    style={{color: 'black', marginLeft:'10px', borderRadius: 3, borderWidth: '0.5'}} name="allenamentoInput" 
                    value={allenamentoInputState} onChange={allenamentoTypedInput} />
                  </label>
              </form>
            </div>


          <h2 className="text-2xl px-7 py-2">Scegli gli esercizi da aggiungere al tuo allenamento!</h2>
          {!isLoading ? 
          <div style={{flexDirection: "column",  marginLeft:'10px', marginTop:'20px'}}>
              {dispalyZone()}
          </div> : <div></div>
          }
          
        <div className="w-full h-10"/>  

        </div>
    )
}

