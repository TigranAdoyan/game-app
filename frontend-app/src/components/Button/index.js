import styled from 'styled-components';

const ButtonComponent = styled.div`
  background-color: #2196f3;
`

export default function Button(props) {
   return (
      <ButtonComponent>
         {props.children}
      </ButtonComponent>
   )
}