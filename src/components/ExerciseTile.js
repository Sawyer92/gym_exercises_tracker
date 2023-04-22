import React, {useState} from "react";
import Icon from '@mui/material/Icon';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';


export default function ExerciseTile (props) {
    
    const [isSelected, setIsSelected] = useState(false);
    const classDeSelected ='w-64 h-20 bg-white border-2 rounded mr-2 ml-2 hover:border-pink-600 hover:border-4 text-black ';
    const classSelected ='w-64 h-20 bg-border-white border-2 rounded mr-2 ml-2 bg-pink-600 text-white';


    return (
        <div className={isSelected ? classSelected : classDeSelected} onClick={()=>{setIsSelected(!isSelected)}}>
            <div className='flex flex-col items-center py-4 ' >
                <h1 className='text-xl font-bold'>{props.title}</h1>
            </div>                     
        </div>
    );
}