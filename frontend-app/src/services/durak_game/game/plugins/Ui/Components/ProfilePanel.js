import React from 'react';
import styled from 'styled-components';

const Container = styled.div(props => {
   return `
     position: absolute;
     background-image: url(${props.src || "http://localhost:3335/static/poker/profiles/empty.png"});
     background-position: center;
     background-size: 155px;
     bottom: ${props.isSelf ? "10px" : "default"};
     top: ${!props.isSelf ? "20px" : "default"};
     width: 110px;
     height: 110px;
     border-radius: 50%;
     border: 1px solid black;
     user-select:none;
     left: ${props.isSelf ? "25%" : "default"};
     right: ${!props.isSelf ? "20%" : "default"};
     display: flex;
     background-color: red;
     justify-content: space-between;
     align-items: center;
     transform: translateX(-50%);
   `
})

const InfoContainer = styled.div(props => {
   return `
     position: absolute;
     bottom: -10px;
     width: 110px;
     height: 23px;
     text-align: center;
     background-color: green;
     background: ${props.isTurn ? "linear-gradient(#EE2222, #733232)" : "linear-gradient(#6E6E6E, #929292)"};
     border-radius: 5px;
   `
})

export default function ProfilePanel(props) {
   return (
       <Container isSelf={props.isSelf} src={props.src}>
          <InfoContainer isTurn={props.isTurn}>
             {props.isAttacker ? "Attacker" : "Defender"}
          </InfoContainer>
       </Container>
   )
}
