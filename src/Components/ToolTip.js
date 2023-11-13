import React, { useState,useEffect,useRef } from 'react';
import styled from 'styled-components';

const ToolTipWrapper = styled.div`
  display: inline-block;
  position: relative;
  cursor: pointer;
  `;

  const ToolTipText = styled.div`
    position: absolute;
    border-radius: 4px;
    left: 50%;
    transform: translateX(-50%);
    padding: 6px;
    color: ${props => props.$textColor || 'white'};
    background: ${props => props.$backgroundColor ? props.$backgroundColor  : 'black'};
    font-size: 14px;
    font-family: sans-serif;
    line-height: 1;
    z-index: 10000;
    white-space: nowrap;
    top: calc(30px * -1);
    &:before {
        content: ' ';
        left: 50%;
        border: solid transparent;
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
        border-width: 6px;
        margin-left: calc(6px * -1);
        top: 100%;
        border-top-color: ${props => props.$backgroundColor ? props.$backgroundColor  : 'black'};
    }
`

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
    <ToolTipWrapper
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
        {children}
      {active && (
        <ToolTipText>
          {text}
        </ToolTipText>
      )}
    </ToolTipWrapper>
  );
};

export default ToolTip