import styled from 'styled-components';

const ContainerComponent = styled.div(props => {
   return `
     background-color: red;
     height: 100vh;
   `
})

function Container(props) {
   return (
       <ContainerComponent style={props.styles}>
          {props.children}
       </ContainerComponent>
   )
}

Container.defaultProps = {
   styles: {}
}

export default Container;