import React from 'react';
import styled from 'styled-components';

const PaginationSelectedOptions ={
    selected: 'list-style-type:none; cursor: pointer; font-weight:bolder; background-color:rgb(229, 226, 226)',
    nonSelected: 'list-style-type:none;'
  }
  const PaginatedNavWrapper = styled.nav`
    display: flex;
    justify-content: center;
  `;
  
  const PaginationContainer = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
  `;
  const PaginatedItem = styled.li`
    display: block;
    padding: 0.25em 0.5em;
    border: 1px solid #999;
    border-radius: 0.1em;
    text-decoration: none;
    color: #333;
    cursor: pointer;
    margin: 0 1px;
    ${({ $selected }) => $selected?PaginationSelectedOptions.selected:PaginationSelectedOptions.notSelected}
  `;
  
  /* PaginatedNav: Functional component that takes the number or pages, a callback function and the current page and returns a 
     simple paginated navigation */ 
     function PaginatedNav({pages,callBack, currentPage}){
      const nav =[];
      for(let i=1;i<=pages;i++){
        nav.push(<PaginatedItem key={i} value={i} onClick={()=>callBack(i)} $selected={currentPage === i}>{i}</PaginatedItem>);
      }
      return (
      <PaginatedNavWrapper>
        <PaginationContainer>{nav}</PaginationContainer>
      </PaginatedNavWrapper>);
    }

    export default PaginatedNav;