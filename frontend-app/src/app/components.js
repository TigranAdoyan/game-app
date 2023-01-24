import styled from "styled-components";

export const AppContainer = styled.div(({props}) => {
   return  `
      background-color: #6F7986;
      background-image: url(${props.backgroundImage});
      position: absolute;
      margin:0px;
      width:100vw;
      height:100vh;
      overflow:auto;
      background-size: cover;
      background-position: center;
   `
})