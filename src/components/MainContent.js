import React,{useState} from 'react';
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Icon from '@mui/material/Icon';
import { useEffect } from 'react';
import ExerciseTile from './ExerciseTile';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LoadingSpinner from './LoadingSpinner';
import EditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';


export default function MainContent () {

  const navigate = useNavigate();
  const urlAPI = 'https://172.31.82.246:8080/api';

  function navigatePage(idTypePassed,idPassed){
      console.log('Vado alla pagina: esercizi/',idTypePassed +'_'+ idPassed);
        navigate(`/esercizi/${idTypePassed}_${idPassed}`, 
        {exerciseType: idTypePassed,exerciseId: idPassed});        
  }


  function vaiToModificaAllenamentoPage(idPassed){
    console.log('Vado alla pagina: allenamento/', idPassed);
      navigate(`/allenamento/${idPassed}`, 
      {allenamentoId: idPassed});        
  }
  
  
  const [arrayAllenamenti, setArrayAllenamenti] = useState([]);
  const [userLogged , setUserLogged] = useState(false);
  const [utente, setUtente] = useState({idUtente: 2});
  const [schedaUtente , setSchedaUtente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mostraElementi, setMostraElementi] = useState([]);
  const [toRefresh , setToRefresh] = useState(false);
  const [showDeleteModal , setShowDeleteModal] = useState(false);
  const [elemToDelete, setElemToDelete] = useState(null);



  function getSchedaUtente(){
    let urlToCall = urlAPI+'/getSchedaByIdUser'+'?idUser='+utente.idUtente;
    fetch(urlToCall).then((response)=> response.json())
    .then((data)=>{
      setSchedaUtente(data);     
      console.log("Scheda trovata: ", data)
      if(data===null || data===undefined || data.length===0){
        console.log("Scheda nulla, da gestire");
      }else{
        let urlToCall = urlAPI+'/getAllenamentiPerScheda?idScheda='+data[0].id;
        fetch(urlToCall).then((response)=> response.json())
      .then((data)=>{
        setArrayAllenamenti(data);
        setIsLoading(false);
        impostaArrayDiFlag(data.length);
      }).catch(function(error){
        console.log("Errore retrieving data Allenamenti", error);
      });
      }
    }).catch(function(error){
      console.log("Errore retrieving Scheda data", error);
    });
  }


  useEffect(()=>{
    getSchedaUtente();
    setToRefresh(false);
  },[isLoading, toRefresh, showDeleteModal])

  function impostaArrayDiFlag(lunghezza){
    let temp = [lunghezza];
    for(let i=0; i<lunghezza; i++){
      temp[i] = false;
    }
    setMostraElementi(temp);
  }

  function espandiRiduciAllenamento(index){
    let tmpArray = mostraElementi.slice();
    for(let i=0; i< tmpArray.length; i++){
      if(i===index){
        tmpArray[i] = !tmpArray[i]
      }
    }
    setMostraElementi(tmpArray);
    mostraNascondiEserciziAllenamento(index);
  }


  function mostraNascondiEserciziAllenamento(idAllenamento){
    return arrayAllenamenti[idAllenamento].listaEsercizi.map((esercizio)=>{
      return( mostraElementi[idAllenamento]?  <div><ExerciseTile title={esercizio.nomeEsercizio} /></div> : null)
    });
  }

  function deleteAllenamento(idAllenamento){
    console.log("Devo eliminare allenamento con id:", idAllenamento)
    if(idAllenamento !== null || idAllenamento !== undefined){
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      };
      let urlToCall = urlAPI+'/eliminaAllenamento'+'?idAllenamento='+idAllenamento;
      fetch(urlToCall, requestOptions).then(res =>{
        console.log("DELETE Effettuata");
        setToRefresh(true);
        setShowDeleteModal(false);
      }).catch(()=>{
        console.log("Errore durante la DELETE");
      })  
    }else {
      //TODO Generare un alert
      console.log("ID Allenamento NULLO")
    }

  }

  const displayAllenamentiTorvati =()=>{
   return arrayAllenamenti.map((allenamento, index) =>{
      return ( <div>
        <ul className='flex flex-col items-center py-5'>
        <div className='flex flex-row justify-center items-center'>
          <div className='flex justify-around font-bold text-2xl py-5 m-5 border-2 border-gray-500 rounded hover:bg-amber-400 hover:text-[#003049]'>
              <li className='w-80 px-2' onClick={()=>{espandiRiduciAllenamento(index);}}>
                {allenamento.nomeAllenamento}
              </li>
              <Icon className='px-10 large' onClick={()=>{espandiRiduciAllenamento(index)}}>
                  {mostraElementi[index] ?   <ExpandLessIcon/> : <ExpandMoreIcon/>}
              </Icon>
          </div>
          <div className='flex'>
          <div className='border-2 border-white rounded-full m-4 h-14 w-14 items-center flex hover:bg-slate-400'>
            <Icon style={{width:'70px', height: '70px', paddingTop: '12px', paddingRight: '15px'}} onClick={()=>{vaiToModificaAllenamentoPage(allenamento.idAllenamento)}}>
              <EditIcon/>
            </Icon>
          </div>
          <div className='border-2 border-white rounded-full m-4 h-14 w-14 items-center flex hover:bg-red-600' 
            data-modal-target="popup-modal" data-modal-toggle="popup-modal" onClick={()=>{ setElemToDelete(allenamento.idAllenamento); console.log("Elem to delete: ",elemToDelete );setShowDeleteModal(true)}}>
            <Icon style={{width:'70px', height: '70px', paddingTop: '12px', paddingRight: '15px'}}>
              <DeleteIcon />
            </Icon>
          </div>
          
          </div>
        </div>
        <div className='flex-row m-4 px-10 grid grid-cols-4 gap-4 '>
          {mostraNascondiEserciziAllenamento(index)}
        </div>
        </ul>
        {showDeleteModal ? 
          <div class="fixed justify-center items-center z-50 m-64 px-52 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div class="relative w-full max-w-md max-h-full">
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" 
                data-modal-hide="popup-modal" onClick={()=>{setShowDeleteModal(false)}}>
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" ></path></svg>
                    <span class="sr-only">Close modal</span>
                </button>
                <div class="p-6 text-center ">
                  <svg aria-hidden="true" class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Confermi l'eliminazione dell'allenamento?</h3>
                  <button data-modal-hide="popup-modal" type="button" onClick={()=>{setShowDeleteModal(false)}}
                  class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 mr-2">No, Annulla</button>
                  <button onClick={()=>{console.log("Elem to delete: ",elemToDelete );deleteAllenamento(elemToDelete)}}
                  class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                      Si, Elimina
                  </button>                  
                </div>
              </div>
            </div>
          </div>
          : null}
      </div>);
    });
  }

  const caricaContenuto=()=>{
    if(isLoading){
      return (<div><LoadingSpinner/></div>);
    } else {
    const schedaTrovata = schedaUtente[0];
    if(schedaTrovata===undefined || schedaTrovata===null){
      return (
        <div className='flex flex-row justify-center'>
          <h1 className='px-5 py-2'>Nessuna scheda presente, creane una adesso!</h1>
          <button className='flex flex-row border-2 rounded-lg px-2 py-2 hover:bg-pink-600' onClick={()=>{navigate('/nuovoAllenamento')}}>
            Crea Scheda
            <ArrowForwardIcon sx={{width:25, height:25}} className='ml-2'/>
          </button>
        </div>
      );
    }else if (arrayAllenamenti===null || arrayAllenamenti===undefined || arrayAllenamenti.length===0){
      return (
        <div className='flex flex-row justify-center'>
          <h1 className='px-5 py-2'>Attenzione! Nessun allenamento presente per la scheda: {schedaTrovata.titolo}</h1>
          <button className='flex flex-row border-2 rounded-lg px-2 py-2 hover:bg-pink-600' onClick={()=>{navigate('/nuovoAllenamento')}}>
            Aggiungi allenamenti
            <ArrowForwardIcon sx={{width:25, height:25}} className='ml-2'/>
          </button>
        </div>
      );
    } else {
      return(
      <div>
        <div className='flex flex-row'>
          <h2 className='font-bold m-5 text-xl'>Trovata scheda utente: </h2>
          <h2 className='font-bold m-5 text-xl'>{schedaTrovata.titolo}</h2>
        </div>
        <h2 className='font-bold m-5 text-xl'>Elenco Allenamenti</h2>
          { displayAllenamentiTorvati()}
      </div>
      );
    }
  }
  }
    return (
      <div className='w-full h-screen'>
        <h1 className='font-bold text-2xl mx-5 py-2 '>Seleziona un allenamento!</h1>
        {caricaContenuto()}
      </div>
    );
  }
