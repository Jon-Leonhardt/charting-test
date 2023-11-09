/* CallAPI: Used to Fetch Data from API endpoint, resolve promise and return json payload from repsonse */
async function CallAPI(url,handleError){
    try {
      const response = await fetch(url);
      const jobs = await response.json();
      return jobs; 
    } 
    catch (error) {
      // nomrally a callback function would be passed in here in order to handle the error by setting a variable that would result in displaying an error message in the main app */
      console.error("A problem was encountered while fetching the data:", error);
      handleError();
    }
      
    return null;
  }
  
  
  
  /* formatTimeStamp: Takes date object and retuns a formatted string of date for display */
  function formatTimeStamp(date){
    return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
  }
  
  /* getMonthAbrvName: Takes a month index value and returns the appropriate month abrevation */
  function getMonthAbrvName(index){
    const months =['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[index];
  }
  
  /* groupJobsByDate: Takes an array of unsorted array of jobs for a rolling 12 months and sorts them and returns an object grouped by month with the month as its index */
  function groupJobsByDate(jobs){
    // since we only need group data by date under current specs, will store an array of each data with its month as key
    // this will also make it easy to calc month aggregates since we wont need to iterate or regroup later on downstream when we display listings on date click 
   
    let sanitizedList = {};
    
    jobs.searches.forEach(d=>{
      const{websiteTitle, websiteOrganization, websiteLocation, websiteDatePublished} = d;
      // assumes all dates in source data are correct, as they will not be validated but this can be done easily.
      console.log(websiteDatePublished)
      const date = new Date(websiteDatePublished);
      const month = getMonthAbrvName(date.getMonth());
      const year = date.getFullYear();
      const dateIndex = `${month} ${year}`;
      //checks to see if an object is already created for a given month and year and creates one if it isnt
      if(!sanitizedList[dateIndex]){
        sanitizedList[dateIndex] =
        {
          month,
          year,
          jobs: []
        }
      }
      sanitizedList[dateIndex].jobs.push({websiteTitle: websiteTitle || '', websiteOrganization: websiteOrganization || '', websiteLocation: websiteLocation || '', date: date});
    });
    return sanitizedList;
  }
  
  /* getAggCounts: Takes the object of jobs grouped by month and year and the currently selected year and returns 
     an array of objects of each month, its index, and its aggregate count of job postings for that month */
  function getAggCounts(data, year){
    const keys = Object.keys(data);
    const jobsMonthlyCount = [];
    
    keys.forEach(d=>{
      if(d === `${data[d].month} ${year}`) jobsMonthlyCount.push({index: d, month: data[d].month, count: data[d].jobs.length});
    });
  
    return sortDateIndex(jobsMonthlyCount, 'asc');
  }

  /* sortDateIndex: Takes an array of jobs data formated for barcharts and and order and returns an array sorted by month in its designated order */
function sortDateIndex(arr,order ){
    const monthIndex ={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11}
    if(order==='desc') return arr.sort((a,b)=>monthIndex[b.month] - monthIndex[a.month])
    return arr.sort((a,b)=>monthIndex[a.month]-monthIndex[b.month])
  }
  function sortJobsByDate(arr,order){
    console.log(arr);
    if(order==='desc') return arr.sort((a,b)=>b.date - a.date)
    return arr.sort((a,b)=>a.date - b.date)
  }
  /* getYears: Takes the entire list of jobs data and returns an array of all years taht appear in data */
  function getYears(jobs){
    const years = [];
    jobs.searches.forEach(d=>{
      const{websiteDatePublished} = d;
      const date = new Date(websiteDatePublished);
      if(years.indexOf(date.getFullYear()) === -1) years.push(date.getFullYear());
    });
    return years.sort((a,b)=>b - a);
  }


export {CallAPI, getAggCounts, groupJobsByDate, getMonthAbrvName, formatTimeStamp, getYears, sortDateIndex,sortJobsByDate}