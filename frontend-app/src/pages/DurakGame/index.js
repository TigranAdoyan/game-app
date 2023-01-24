import React from 'react';
import { useParams } from 'react-router-dom';
import jquery from 'jquery';
import './styles.scss';
import {DurakContainer} from "./components";
import game from "../../services/durak_game";


export default function DurakGame() {
   const params = useParams();
   // const canvasEl = useRef(null);

   React.useEffect(() => {
      const authToken = localStorage.getItem('token');
      if (params.id && authToken) {
         game.setupGame({
            jquery,
            gameId: params.id,
            authToken
         });
      }
   }, []);

   return (
       <DurakContainer id="durak_game_container">
          <div id="durak_game_ui_container"/>
          <canvas/>
       </DurakContainer>
   )
}
