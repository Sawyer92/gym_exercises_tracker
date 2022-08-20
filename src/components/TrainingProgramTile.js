
export default function TrainingProgramTile(props){
    return (
        <div className="item-container" onClick={props.selectProgram}>
            <h2 className="item-container-text">
                {props.title}
            </h2>
        </div>
    );
}