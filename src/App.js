import React, { useState, useEffect } from 'react';
import {JobsTable, YearsSelection, Loader, SimpleBarChart} from './components.js'
import {CallAPI, getAggCounts, groupJobsByDate, getYears} from './utilities.js'
import './App.css';


function App() {

// Kicks eveything off by calling api and setting state values based on data returned
 useEffect(() => {
   const getJobs = async()=>{
    const jobs = await CallAPI();
    const jobList = groupJobsByDate(jobs);
    const years = getYears(jobs);
    setJobs(jobList);
    setYears(years);
    setSelectedYear(years[0])
  }
  getJobs();
  }, []); 

  // gets screen width onload and sets intital width for barchart, also sets a listener for resizing the window
  useEffect(()=>{
    window.addEventListener('resize', () =>{ 
      setWidth(0.8 * window.innerWidth)
      console.log(window.innerHeight)
    });
    setWidth(0.8 * window.innerWidth);

  },[]);


 const [jobs, setJobs] = useState();
 const [years, setYears] = useState([]);
 const [currentSelection, setSelection] = useState(-1);
 const [width,setWidth] = useState(0)
 const [selectedYear,setSelectedYear] = useState(-1);
  
  return (
    <div className='App'>
      <header className='page-header'>
        
      </header>
      <div className='mainBody'>
        <h3>Job Postings by Month {selectedYear !== -1 && `for ${selectedYear}`}</h3>
        <div className='chart-container'>
          {years.length > 0 && <YearsSelection currentSelection={selectedYear} years ={years} handleSelection={(e)=>{setSelectedYear(e); setSelection(-1)}} /> }
          {jobs?<SimpleBarChart width={width} height={300} data={getAggCounts(jobs, selectedYear)} yAxisTitle='Months' callBack={(e,d)=>{setSelection(d)}} selected={currentSelection} />:<Loader />}
          {currentSelection!==-1 && <JobsTable jobs={jobs[currentSelection].jobs} jobsPerPage={10} width={width}  />}
        </div>
      </div>
    </div>
  );
}

export default App;
