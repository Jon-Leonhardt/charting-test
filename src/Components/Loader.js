import styled,{keyframes} from 'styled-components';

const SpinnerAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
  `
  const LoadingMask = styled.div`
    margin: auto;
    border: 3px solid #EAF0F6;
    border-radius: 50%;
    border-top: 3px solid #333;
    width: 20px;
    height: 20px;
    animation: ${SpinnerAnimation} 2s linear infinite;
    vertical-align: middle;
  `;


  function Loader(){
    return(<LoadingMask />)
  }

export default Loader;