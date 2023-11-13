import React, { useState, useEffect } from 'react';
import {JobsTable, YearsSelection, Loader, SimpleBarChart,Alert} from './Components/index.js';
import {CallAPI, getAggCounts, groupJobsByDate, getYears} from './utilities.js';
import Styled from 'styled-components';
import './App.css';

const MainBody = Styled.div`
  text-align: center;
  margin: auto;
`;

const PageHeader = Styled.header`
  background-color:rgb(32, 168, 241);
  height: 100px;
  margin-top:0px;
  vertical-align: middle;
  background-image: url('https://static.vecteezy.com/system/resources/previews/006/998/394/non_2x/blue-abstract-background-blue-background-design-abstract-futuristic-background-free-vector.jpg');
`;

const ChartContainer = Styled.div`
  vertical-align: middle;
  min-height: 200px;
  display:inline-block;
  align-items:center;
`;


function App() {

// Kicks eveything off by calling api and setting state values based on data returned
 useEffect(() => {
   const getJobs = async()=>{
    const url ='https://dsg-api-test.k2-app.com/ats/search/all';
    const jobs = await CallAPI(url,()=>setLoadError(true));
    if(jobs){
    const jobList = groupJobsByDate(jobs);
    const years = getYears(jobs);
    setJobs(jobList);
    setYears(years);
    setSelectedYear(years[0])
    }
  }
  getJobs();
  }, []); 

  // gets screen width onload and sets intital width for barchart, also sets a listener for resizing the window
  useEffect(()=>{
    window.addEventListener('resize', () =>{ 
      setWidth(0.8 * window.innerWidth)
    });
    setWidth(0.8 * window.innerWidth);

  },[]);


 const [jobs, setJobs] = useState();
 const [years, setYears] = useState([]);
 const [currentSelection, setSelection] = useState(-1);
 const [width,setWidth] = useState(0)
 const [selectedYear,setSelectedYear] = useState(-1);
 const [loadError,setLoadError] = useState(false);
  
  return (
    <div className='App'>
      <PageHeader className='page-header'>
        
      </PageHeader>
      {
        !loadError ?
        (
          <MainBody>
          <h3>Job Postings by Month {selectedYear !== -1 && `for ${selectedYear}`}</h3>
            
            <ChartContainer>
              {years.length > 0 && <YearsSelection currentSelection={selectedYear} years ={years} handleSelection={(e)=>{setSelectedYear(e); setSelection(-1)}} /> }
              {jobs?<SimpleBarChart width={width} height={300} data={getAggCounts(jobs, selectedYear)} yAxisTitle='Months' callBack={(e,d)=>{setSelection(d)}} selected={currentSelection} />:<Loader />}
              {currentSelection!==-1 && <JobsTable jobs={jobs[currentSelection].jobs} jobsPerPage={10} width={width}  />}
            </ChartContainer>
          </MainBody>):<Alert msg='There was an error fetching the data. Page loaded with Errors' type='error' />
        }
    </div>
  );
}

export default App;
