import React from 'react';
import { useParams } from 'react-router-dom';
import './styles.scss';
import Game from "../../services/chees_game";

export default function DurakGame() {
   const params = useParams();
   // const canvasEl = useRef(null);

   // React.useEffect(() => {
   //    const authToken = localStorage.getItem('token');
   //    if (params.id && authToken) {
   //       game.setupGame({
   //          jquery,
   //          gameId: params.id,
   //          authToken
   //       });
   //    }
   // }, []);

    React.useEffect(() => {
       //  setTimeout(() => {
            new Game()
       //  }, 1000)
    }, []);

   return (
       <div id="chess_container"/>
   )
}
