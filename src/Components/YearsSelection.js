function YearsSelection({years, handleSelection, currentSelection}){
    const yearsList = years.map(d=>{
        return (<option value={d} key={`years-selection-${d}`}>{d}</option>);
    });
    return(
    <div>
        <label htmlFor='select-years'>Select a Year:</label>
        <select id='select-years' name='years' onChange={(e)=>{handleSelection(e.target.value)}} value={currentSelection}>
        {yearsList}
        </select>
    </div>
    );
}

export default YearsSelection;