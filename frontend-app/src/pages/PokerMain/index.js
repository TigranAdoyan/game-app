import React from "react";
import styled from 'styled-components';
import Sidebar from "./Sidebar";
import Table from "./Table";
import Modal from "./Modal";

import dashboardIo from "../../services/socket/dashboard";
import {useNavigate} from "react-router";

export const Container = styled.div`
  width: 1300px;
  height: 740px;
  position: relative;
  top: 100px;
  margin: auto;
  background-image: url('http://localhost:3335/static/poker/bg_1.jpg');
  background-size: cover;
  background-position: center;
  opacity: 1;
  display: flex;
  border-radius: 35px;
  overflow: hidden;
  cursor: default;
  user-select: none;
  z-index: 5;
`

const defaultModalState = {
   status: false,
   type: '',
   player: {},
   token: ''
};

export default function PokerMain() {
   const navigate = useNavigate();
   const [players, setPlayers] = React.useState([]);
   const [modalStatus, setModalStatus] = React.useState(defaultModalState);

   function onPlayersList(payload = []) {
      if (payload.length) setPlayers(payload);
   }

   function onPlayerUpdate(payload) {
      setPlayers(prev => prev.map(el => {
         if (payload.userId === el.id) el.online = payload.status;
         return el;
      }));
   }

   function onSubmitInvitation(data) {
      navigate(`/durak/${data.gameId}`);
   }

   function onInviteToGame(props) {
      setModalStatus({
         status: true,
         type: 'receive_invite',
         player: props.sender,
         token: props.token
      })
   }

   function inviteToGame(playerId) {
      setModalStatus({
         status: true,
         type: 'send_invite',
         player: players.find(player => player.id === playerId)
      })
   }

   React.useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) dashboardIo.create(token);
      dashboardIo.socket.on(dashboardIo.events.server.users_list, onPlayersList);
      dashboardIo.socket.on(dashboardIo.events.server.user_online_status_update, onPlayerUpdate);
      dashboardIo.socket.on(dashboardIo.events.server.invite_to_game, onInviteToGame);
      dashboardIo.socket.on(dashboardIo.events.server.submit_invite_to_game, onSubmitInvitation);
      dashboardIo.socket.emit(dashboardIo.events.client.users_list, {
         include: ['all']
      });
   }, []);

   return (
       <Container>
          {modalStatus.status && <Modal {...modalStatus} setModalStatus={setModalStatus}/>}
          <Sidebar/>
          <Table players={players} emitInviteToGame={inviteToGame} />
       </Container>
   )
}
