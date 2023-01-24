import styled from "styled-components";

export default styled.div(props => {
   return `
        background-image: url(${props.src || "http://localhost:3335/static/poker/profiles/empty.png"});
        background-position: center;
        background-size: 80px;
        width: 40px;
        height: 40px;
        position: relative;
        margin-right: 20px;
        display: block;
        border-radius: 50%;
        &::after {
           content: '';
           display: block;
           position: absolute;
           background-color: ${props.online ? '#419A45' : 'silver'};
           top: 30px;
           left: 0;
           width: 10px;
           height: 10px;
           border-radius: 50%;
        }
   `
});
