import styled from 'styled-components';
import { Label, Input } from "reactstrap";

export const Container = styled.div`
  background-color: rgba(79, 79, 87, .9);
  background-size: auto 100%;
  display: flex;
  flex-direction: column;
  top: 20vh;
  height: 50vh;
  min-height: 600px;
  width: 20vw;
  min-width: 350px;
  position: relative;
  border-radius: 10px;
  border: 10px solid brown;
  margin: auto;
`

export const Header = styled.span`
  font-max-size: 40px;
  font-min-size: 15px;
  font-size: 35px;
  color: antiquewhite;
  text-align: center;
  margin: 20px auto;
  min-width: 300px;
  width: 30%;
`

export const Form = styled.div`
  display: flex;
  margin: 100px 40px 0;
  border-radius: 10px;
  height: 350px;
  flex-direction: column;
  align-items: center;
`

export const CustomLabel = styled(Label)(props => {
   return `
      color: ${props.error ? 'red' : 'white'};
      display: inline-block;
      padding-left: 10px;
      margin-bottom: 2px;
   `
})

export const CustomInput = styled(Input)(props => {
   return `
      box-sizing: border-box;
      border: 3px solid ${props.error ? 'red' : 'rgb(82, 74, 73)'}; 
      &:focus {
           border: 'rgb(82, 74, 73)';
      }
   `
})

export const SubmitButton = styled.button(props => {
   return `
        margin-top: auto;
        padding: 10px 40px;
        background-color: rgb(204, 110, 110);
        border: 0;
        color: white;
        transition: .3s;
        border-radius: 5px;
        &:hover {
          background-color: ${props.disabled ? 'rgb(204, 110, 110)' : 'rgb(212, 42, 42)'};
          cursor: ${props.disabled ? 'default' : 'pointer'};
          transition: .3s;
        }
        &:focus {
          background-color: ${props.disabled ? 'rgb(204, 110, 110)' : 'rgb(212, 42, 42)'};
          cursor: ${props.disabled ? 'default' : 'pointer'};
          transition: .3s;
        }
   `
})