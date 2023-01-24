import React from 'react';
import styled from 'styled-components';

const ActionButton = styled.div(props => {
   return `
        width: 120px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FEFEFE;
        font-size: 13px;
        background-color: ${props.active ? "#7F167F" : "#856A9F"};
        transition: .1s;
        border-radius: 5px;
        letter-spacing: 1px;
        margin: 0 10px;
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
        &:hover {
          ${props.active ? `
             transition: .1s;
             background-color: #460C68;
             cursor: pointer;
             box-shadow: 0 0 23px 11px rgba(127, 22, 127, .75);
             -webkit-box-shadow: 0 0 23px 11px rgba(127, 22, 127, .75);
             -moz-box-shadow: 0 0 23px 11px rgba(127, 22, 127, .75);
          ` : ''}
        }
        &:active {
        ${props.active ? `
             width: 123px;
             height: 38px;
             transition: none;
          ` : ''}
        }
   `
})

export default function ActionsPanel(props) {
   return (
       <div className="actions_panel_container">
          <ActionButton
             onClick={() => props.isTurn && props.onAction({
                action: props.isAttacker ? 'pass' : 'collect'
             })}
             active={props.isActive}>
             {props.isAttacker ? 'Pass' : 'Collect'}
          </ActionButton>
       </div>
   )
}
