import React,{useState} from 'react';
import allenamenti from '../utils/Programs'
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import { ListItemIcon, ListItemButton, ListItemText} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate } from "react-router-dom";

export default function MainContent () {

  const navigate = useNavigate();

    function navigatePage(idTypePassed,idPassed){
      console.log('Vado alla pagina: esercizi/',idTypePassed +'_'+ idPassed);
        navigate(`/esercizi/${idTypePassed}_${idPassed}`, 
        {exerciseType: idTypePassed,exerciseId: idPassed});        
    }
  
  const [arrayAllenamenti, setArrayAllenamenti] = useState(allenamenti);
  
  function selectProgram(idElem){
    //metto a false l'isShow di tutti gli altri allenamenti nell'array,
    //cerco l'elemento con id = idElem, se esiste, lo metto con il valore negato di isElem
    let indicePosElementoDaModificare = arrayAllenamenti.indexOf(arrayAllenamenti[idElem]);
    let tmpArray = arrayAllenamenti.slice();
    //con questo indice indicePosElementoDaModificare mi prendo gli elementi da 0 a prima di questo id, e da id+1 a fine array, e li setto a false
    for(let i=0; i<indicePosElementoDaModificare; i++){
      tmpArray[i].isShown=false;
    }
    for(let j = indicePosElementoDaModificare+1; j<tmpArray.length; j++){
      tmpArray[j].isShown = false;
    }
      if(indicePosElementoDaModificare !== -1){ //se l'elemento con quell'id esiste 
        console.log("Elem trovato:", indicePosElementoDaModificare);
        tmpArray[indicePosElementoDaModificare].isShown =! arrayAllenamenti[indicePosElementoDaModificare].isShown;
      }
      setArrayAllenamenti(tmpArray);
  }


    let es = null;
    
     const programmi = arrayAllenamenti.map(tipoAllenamento => 
      {
        console.log("Dato: ",tipoAllenamento.isShown );
        {es = tipoAllenamento.exercises.map(esercizio =>{
          return (
          <List>
            <ListItemButton onClick={()=> {navigatePage(tipoAllenamento.id,esercizio.exerciseId)}}>
            <ListItemIcon>
              <FitnessCenterIcon/>
            </ListItemIcon>
            <ListItemText primary={esercizio.exerciseName} />
            </ListItemButton>
            </List>)
         }); 
         return (
      <div>
      <ListItemButton key={tipoAllenamento.id}  onClick={() => {selectProgram(tipoAllenamento.id)}}>
        <ListItemText primary={tipoAllenamento.title} />
        {tipoAllenamento.isShown ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      {tipoAllenamento.isShown &&  es}
      </div>
    );
      }
    }
      );

    return (
      <List
      sx={{ width: '100%', maxWidth: 560, bgcolor: 'background.paper', flex: 1 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          <h2>Elenco Allenamenti</h2>
        </ListSubheader>
      }
    >
      {programmi}
    </List>
    );
  }

