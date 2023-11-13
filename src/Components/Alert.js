import React from 'react';
import styled from 'styled-components';

const AlertVariants = {
    error: 'color: #721c24; background-color: #f8d7da; border-color: #f5c6cb;',
    general: 'color: #004085; background-color: #cce5ff; border-color: #b8daff;',
    success: 'color: #155724; background-color: #d4edda; border-color: #c3e6cb;',
    warning: 'color: #856404; background-color: #fff3cd;border-color: #ffeeba;'
  }
  
const AlertContainer = styled.div`
    position: relative;
    padding: 0.75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    ${({ $type }) => AlertVariants[$type] || AlertVariants.general}
    &:before, :after {
      box-sizing: border-box;
    }
`
  
function Alert({msg,type}){
    return (<AlertContainer $type={type}>{msg}</AlertContainer>);
}

  export default Alert