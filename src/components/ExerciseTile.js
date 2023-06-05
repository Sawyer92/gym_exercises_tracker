import React, {useState} from "react";
import Icon from '@mui/material/Icon';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ExerciseTile (props) {

    const [toRefreshParent, setToRefreshParent] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const classDeSelected ='flex flex-row items-center w-64 h-20 bg-white border-2 rounded mr-2 ml-2 hover:border-pink-600 hover:border-4 text-black px-16';
    const classSelected ='flex flex-row items-center w-64 h-20 bg-border-white border-2 rounded mr-2 ml-2 bg-pink-600 text-white px-16';
    const classToEdit ='flex flex-row items-center align-top w-64 h-20 bg-white border-2 rounded mr-2 ml-2 hover:border-pink-600 hover:border-4 text-black';
    const allenamentoId = props.allenamentoId;
    const esercizioId = props.esercizioId;
    const urlAPI = 'http://localhost:8080/api/';  

    function eliminaEsercizio (allenamentoId, esercizioId) {
        console.log("Devo eliminare esercizio con id: ", esercizioId);
        let urlToCall = urlAPI+'deleteEsercizioFromAllenamento?idAllenamento='+allenamentoId+'&idEsercizio='+esercizioId;
        const requestOptions = {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
          };
        fetch(urlToCall,requestOptions).then((response)=> {response.json(); props.triggerSuEsercizi(setToRefreshParent(true));})
        .catch(function(error){
            console.log("Errore in eliminazione esercizio", error);
        }); 
    }



    const isInModifica = ()=>{
        /*
        if(props.iSToEdit){
           return(
            <div className={classToEdit}>
                <Icon style={{width:'70px', height: '70px', paddingTop: '12px', paddingRight: '15px',}} onClick={eliminaEsercizio(allenamentoId, esercizioId)}>
                    <DeleteIcon className="hover:fill-red-600" />
                </Icon>
                <h1 className='text-xl font-bold'>{props.title}</h1>          
        </div>
           ); 
        } else {
        */ 
            return(
                <div className={isSelected ? classSelected : classDeSelected} onClick={()=>{setIsSelected(!isSelected)}}>
                    <h1 className='text-xl font-bold'>{props.title}</h1>                    
                </div>
            );
        //}
    }

    return (
        <div className={isSelected ? classSelected : classDeSelected} onClick={()=>{setIsSelected(!isSelected)}}>
                    <h1 className='text-xl font-bold'>{props.title}</h1>                    
                </div>
        
    );
}