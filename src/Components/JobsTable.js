import React, { useState,useEffect} from 'react';
import {formatTimeStamp,sortJobsByDate} from '../utilities.js';
import styled from 'styled-components';
import PaginatedNav from './PaginatedNav';
import Elipsis from './Elipsis';

const JobsTableRow = styled.tr`
    border: 1px solid rgb(203, 200, 200);
    border-collapse: collapse;
    text-align: left;
    padding: 10px;
    line-height: 1.5;
    &:nth-child(odd) {
      background-color:rgb(251, 251, 252)
    }
    &:nth-child(even) {
      background-color: rgb(244, 244, 244);
      
    }
    @media screen and (max-width: 600px) {
      margin-bottom: 10px;
      display: block;
      border-bottom: 2px solid #ddd;
      &:last-child {
        border-bottom: 0;
      }
    }
`;

const JobsTableCell = styled.td`
    padding:10px;
    vertical-align: top;
    @media screen and (max-width: 600px) {
      display: block;
      text-align: right;
      font-size: 13px;
      &:before {
        content: attr(data-label);
        float: left;
        text-transform: uppercase;
        font-weight: bold;
    }
`;

const JobsTableContainer = styled.table`
    margin: auto;
    border: 1px solid rgb(203, 200, 200);
    border-collapse: collapse;
    text-align: left;
    padding: 10px;
    line-height: 1.5;
    @media screen and (max-width: 600px) {
      border: 0;
    }
`;

const JobsTableHeaderCell = styled.th`
    background-color: rgb(57, 57, 57);
    color: #fff;
    padding:10px;
    @media screen and (max-width: 600px) {

    }
`;
  
const JobsTableFooterRow = styled.tr`
    padding:5px;
    line-height: .9;
`;
const JobsTableBody = styled.tbody``;

const JobsTableHeader=styled.thead`
    @media screen and (max-width: 600px) {
        display: none;
    }
  `;

const JobsTableFooter = styled.tfoot``;

function JobsTable({jobs, jobsPerPage, width}){
    useEffect(()=>{
      setCurrentPage(1); // resets current page when a new month or year is selected and the jobs array changes only
    },[jobs,jobsPerPage]);
  
    
    const pages = Math.ceil(jobs.length / jobsPerPage);
    const tableHeader= (<JobsTableRow><JobsTableHeaderCell width='35%' scope='col'>Job Title</JobsTableHeaderCell><JobsTableHeaderCell width='25%' scope='col'>Organization</JobsTableHeaderCell><JobsTableHeaderCell width='15%' scope='col'>Location</JobsTableHeaderCell><JobsTableHeaderCell width='15%' scope='col'>Posted</JobsTableHeaderCell></JobsTableRow>);
    const[currentPage,setCurrentPage] = useState(1);
    const start = (currentPage-1) * jobsPerPage;
    const limit = jobs.length > jobsPerPage && jobs.length >= (start + jobsPerPage)?jobsPerPage * currentPage:jobs.length;
    const rows = sortJobsByDate(jobs,'asc').slice(start,limit).map((d,i)=>{
      return(
        <JobsTableRow key={`row-${i}-page-${currentPage}`} >
          <JobsTableCell key={`cell-${d.websiteTitle}-${i}-page-${currentPage}`} data-label='Job Title'><Elipsis text={d.websiteTitle} textLimit={30} /></JobsTableCell>
          <JobsTableCell key={`cell-$${d.websiteOrganization}-${i}-page-${currentPage}`} data-label='Organization'><Elipsis text={d.websiteOrganization} textLimit={30} /></JobsTableCell>
          <JobsTableCell key={`cell-$${d.websiteLocation}-${i}-page-${currentPage}`} data-label='Location'><Elipsis text={d.websiteLocation} textLimit={30} /></JobsTableCell>
          <JobsTableCell key={`cell-$${d.date}-${i}-page-${currentPage}`} data-label='Posted'>{formatTimeStamp(d.date)}</JobsTableCell>
        </JobsTableRow>
      );
    })
  
    return(
    <JobsTableContainer width={width}>
      <JobsTableHeader >{tableHeader}</JobsTableHeader> 
      <JobsTableBody>
        {rows}
      </JobsTableBody>
      {pages>1&& 
      <JobsTableFooter>
        <JobsTableFooterRow>
          <JobsTableCell  colSpan='6'><PaginatedNav callBack={(d)=>setCurrentPage(d)} currentPage={currentPage} pages={pages} /></JobsTableCell>
          </JobsTableFooterRow>
        </JobsTableFooter>}
    </JobsTableContainer>
    );
}

export default JobsTable;