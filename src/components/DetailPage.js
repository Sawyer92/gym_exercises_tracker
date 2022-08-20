import React from "react";
import Programs from "../utils/Programs";
import { useParams } from "react-router-dom";

export default function DetailPage(){

const params = useParams();

const exerciseType = parseInt(params.idType.replace(/_/g, ''));
const idExercise = parseInt(params.idEx);

const allenamento = Programs.filter(al => al.id === exerciseType);
const esercizio = allenamento[0].exercises.filter(ex => ex.exerciseId === idExercise);
let ex = esercizio[0];

return (
        <div>
            <h2>Pagina di dettaglio dell'esercizio: {ex.exerciseName} </h2>
        </div>
    )
}