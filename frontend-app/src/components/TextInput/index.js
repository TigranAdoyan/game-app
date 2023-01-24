import styled from 'styled-components';
import {Label, Input} from 'reactstrap';
import './index.scss';

const InputContainer = styled.div`
    width: 100%;
`

const CustomLabel = styled(Label)`
    
`


function TextInput(props) {
   return (
       <InputContainer>
          <CustomLabel for={props.name}> {props.name} </CustomLabel>
          <Input
              {...props}
          />
       </InputContainer>
   )
}

TextInput.defaultProps = {
   label: '',
   value: '',
   name: '',
   type: '',
   style: {},
}

export default TextInput;