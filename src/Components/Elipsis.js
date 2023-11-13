import React from 'react';
import ToolTip from './ToolTip';

function Elipsis({text, textLimit}){
    // confirms text is over the text length limit and returns the component
    if(text.length > textLimit)return(<ToolTip text={text} delay='400'>{`${text.substr(0,textLimit)}...`}</ToolTip>);
    return text;

}
export default Elipsis;