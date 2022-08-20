import React from "react";


export default function ExerciseTile (props) {
    return (
        <div className="exercise-container">
            <h2 className="item-container-text">{props.exerciseName}</h2>
        </div>
    );
}