import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  width: 75%;
  float: right;
  background-color: rgba(43, 43, 43, .7);
  padding: 160px 20px 30px;
`

const HeaderRaw = styled.div`
  width: 100%;
  height: 40px;
  border-radius: 10px;
  padding-left: 100px;
  display: flex;
  justify-content: start;
  margin-bottom: 20px;
  align-items: center;
  background-color: rgb(88, 88, 88);
  border: 3px solid #C2C2C2;
  color: blanchedalmond;
`;

const DataRaw = styled.div`
  width: 100%;
  height: 50px;
  position: relative;
  border-radius: 10px;
  padding-left: 100px;
  display: flex;
  justify-content: start;
  align-items: center;
  background-color: rgba(88, 88, 88, .9);
  color: blanchedalmond;
  margin-bottom: 20px;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
    outline: 1px solid #C2C2C2;
  }
`;

const RawElement = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 100%;
  text-align: center;
`

const ProfileImg = styled.div(props => {
   return `
        background-image: url(${props.src || "http://localhost:3335/static/poker/profiles/empty.png"});
        background-position: center;
        background-size: 80px;
        width: 40px;
        height: 40px;
        position: absolute;
        left: 30px;
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

const InviteButton = styled.div(props => {
   return `
     background-color: ${props.online ? '#419A45' : '#ADADAD'};
     color: ${props.online ? '#FFFFFF' : '#282828'};
     font-family: MM Armen;
     font-style: Normal;
     font-size: 12px;
     border-radius: 5px;
     padding: 5px 20px;
     line-height: 13px;
     align-items: center;
     vertical-align: center;
     position: absolute;
     letter-spacing: 3px;
     right: 50px;
     transition: .2s;
     &:hover {
       text-decoration: ${props.online ? 'underline' : 'none'};
       background-color: ${props.online ? '#419A45' : '#ADADAD'};
       cursor: ${props.online ? 'pointer' : 'default'};
       transition: .2s;
     }
   `
});

export default function Table(props) {
    return (
       <Container>
          <HeaderRaw>
             <RawElement>username</RawElement>
             <RawElement>email</RawElement>
          </HeaderRaw>
           {
               props.players.map(player => {
                   console.log('player.profile_img_url', player.profile_img_url);
                   return (
                      <DataRaw key={player.id}>
                           <ProfileImg src={player.profile_img_url} online={player.online}/>
                           <RawElement> {player.username} </RawElement>
                           <RawElement> {player.email} </RawElement>

                         <InviteButton online={player.online} onClick={() => player.online && props.emitInviteToGame(player.id)}>Invite</InviteButton>
                      </DataRaw>
                   )
               })
           }
       </Container>
   )
}
