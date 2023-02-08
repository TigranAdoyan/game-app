import React from 'react';
import { useParams } from 'react-router-dom';
import './styles.scss';
import Game from "../../services/chees_game";

export default function DurakGame() {
   const params = useParams();
    React.useEffect(() => {
       //  setTimeout(() => {
            new Game()
       //  }, 1000)
    }, []);

   return (
       <div id="chess_container"/>
   )
}
