import React, { useState,useEffect,useRef } from 'react';
import {formatTimeStamp,sortJobsByDate} from './utilities.js';
import * as d3 from 'd3';

/* Alert: Functional Compoent that takes a message and displays an alert banner */
function Alert({msg,type}){
  const alertMapping ={error:'alert-error', general: 'alert-general', success: 'alert-success', warning:'alert-warning' }
  return (<div className={`alert ${alertMapping[type]}`}>{msg}</div>);
}

/* ToolTip: Functional component that takes text returns a simple tooltip and wrapper */
function ToolTip({text, delay, children}){
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay || 400);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className='tooltip'
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
        {children}
      {active && (
        <div className='tooltiptext'>
          {text}
        </div>
      )}
    </div>
  );
};

/* Elipsis: Functional component that takes text and a text length limit and returns a simple wrapper with abbreivated text and a tooltip wrappe for the text */
function Elipsis({text, textLimit}){
    // confirms text is over the text length limit and returns the component
    if(text.length > textLimit)return(<ToolTip text={text} delay='400'>{`${text.substr(0,textLimit)}...`}</ToolTip>);
    return text;

}

/* PaginatedNav: Functional component that takes the number or pages, a callback function and the current page and returns a 
   simple paginated navigation */ 
   function PaginatedNav({pages,callBack, currentPage}){
    const nav =[];
    for(let i=1;i<=pages;i++){
      nav.push(<li key={i} value={i} onClick={()=>callBack(i)} className={currentPage === i?'paginated-nav-selected':'paginated-nav'}>{i}</li>);
    }
    return (
    <nav>
      <ul className='pagination'>{nav}</ul>
    </nav>);
  }

  /* JobsTable:  Functional component that takes the list of jobs for a month and number of jobs to display per page and returns a table component that displays the jobs */ 
  function JobsTable({jobs, jobsPerPage, width}){
    useEffect(()=>{
      setCurrentPage(1); // resets current page when a new month or year is selected and the jobs array changes only
    },[jobs,jobsPerPage]);
  
    
    const pages = Math.ceil(jobs.length / jobsPerPage);
    const tableHeader= (<tr><th width='35%' scope='col'>Job Title</th><th width='25%' scope='col'>Organization</th><th width='15%' scope='col'>Location</th><th width='15%' scope='col'>Posted</th></tr>);
    const[currentPage,setCurrentPage] = useState(1);
    const start = (currentPage-1) * jobsPerPage;
    const limit = jobs.length > jobsPerPage && jobs.length >= (start + jobsPerPage)?jobsPerPage * currentPage:jobs.length;
    const rows = sortJobsByDate(jobs,'asc').slice(start,limit).map((d,i)=>{
      return(
        <tr key={`row-${i}-page-${currentPage}`} >
          <td className='jobs-table-cell'  key={`cell-${d.websiteTitle}-${i}-page-${currentPage}`} data-label='Job Title'><Elipsis text={d.websiteTitle} textLimit={30} /></td>
          <td className='jobs-table-cell' key={`cell-$${d.websiteOrganization}-${i}-page-${currentPage}`} data-label='Organization'><Elipsis text={d.websiteOrganization} textLimit={30} /></td>
          <td className='jobs-table-cell' key={`cell-$${d.websiteLocation}-${i}-page-${currentPage}`} data-label='Location'><Elipsis text={d.websiteLocation} textLimit={30} /></td>
          <td className='jobs-table-cell' key={`cell-$${d.date}-${i}-page-${currentPage}`} data-label='Posted'>{formatTimeStamp(d.date)}</td>
        </tr>
      );
    })
  
    return(
    <table className='jobs-table' width={width}>
      <thead className='jobs-table-header'>{tableHeader}</thead> 
      <tbody>
        {rows}
      </tbody>
      {pages>1&& <tfoot className='jobs-table-foot'><tr><td  colSpan='6'><PaginatedNav callBack={(d)=>setCurrentPage(d)} currentPage={currentPage} pages={pages} /></td></tr></tfoot>}
    </table>
    );
  }

/*YearsSelection: takes an array of years, a callback function and the currently selected year and returns a select component */
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

  /* Loader: Function compnent that returns a loading Mask*/
  function Loader(){
    return(<div className='loader' />)
  }

  /* SimpleBarChart: D3 based functional component that takes an array of jobs data, width, width, a callback function, 
     and a selected index and returns a simple barchart that supports bar selection */
  function SimpleBarChart({ width, height, data, yAxisTitle, callBack, selected }) {
    const margin = {top: 30, right: 40, bottom: 70, left: 40};
    const ref = useRef(null);
    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        svg.attr('width', width)
        .attr('height', height);

        const selection = svg.selectAll('rect').data(data);
        
        // Adding X scale and axis
        const x = d3.scaleBand()
        .range([ 0, width-margin.left ])
        .domain(data.map(function(d) { return d.month; }))
        .padding(0.2);
        svg.append('g')
        .attr('transform', `translate(${margin.left},${height-margin.top})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end');

        // Adding Y scale and axis
        const y = d3.scaleLinear()
        .domain([0, d3.max(data, d=> d.count)])
        .range([ height-margin.top-margin.bottom, 0]);
        svg.append('g')
        .call(d3.axisLeft(y)).attr('transform', `translate(${margin.left},${margin.bottom})`);

        // Adding bars to chart
        selection.enter()
        .append('rect')
        .on('click', (e,d)=>{
            if(callBack)callBack(e,selected!==d.index?d.index:-1);
        })
        .attr('x', (d) =>x(d.month))
        .attr('y', (d)=> y(d.count))
        .attr('width', x.bandwidth())
        .attr('transform', `translate(${margin.left},${margin.bottom})`)
        .attr('height', (d)=>height-margin.top-margin.bottom - y(d.count))
        .attr('class',(d)=>{
            if(selected === d.index) return 'simple-bar-chart-bar selected'
            return 'simple-bar-chart-bar';
        });
    },[selected,data]);

    return (
        <div className='simple-bar-chart' width={width}  >
            <svg  ref={ref}  />
        </div>
    );
}
export { ToolTip, PaginatedNav, JobsTable, YearsSelection, Loader, Elipsis, SimpleBarChart,Alert};