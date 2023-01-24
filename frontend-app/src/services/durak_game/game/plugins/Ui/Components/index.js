import React, {useEffect} from 'react';
import _ from 'lodash';
import StateContext from '../context';
import ActionPanel from './ActionsPanel';
import ProfilePanel from "./ProfilePanel";

export default function Root(props) {
    const [c, setC] = React.useState(null)

    useEffect(() => {
       setInterval(() => {
          setC(_.cloneDeep(props.getGameState()))
       }, 300)
    }, [])

    return (
        <>
           {
              c && (
                     <>
                        <ProfilePanel
                            src={c.myData.profile_img_url}
                            isTurn={c.turnPlayerId === c.myData.id}
                            isAttacker={c.attackerPlayerId === c.myData.id}
                            isSelf={true}
                        />
                        {
                           Object.values(c.connectedPlayers).map(player => {
                              return <ProfilePanel
                                  key={player.id}
                                  src={c.myData.profile_img_url}
                                  isTurn={c.turnPlayerId === player.id}
                                  isAttacker={c.attackerPlayerId === player.id}
                                  isSelf={false}
                              />
                           })
                        }
                        <ActionPanel
                            isAttacker={c.attackerPlayerId === c.myData.id}
                            isActive={c.turnCards.length && c.turnPlayerId === c.myData.id}
                            isTurn={c.turnPlayerId === c.myData.id}
                            onAction={props.onAction}
                        />
                     </>
               )
           }
        </>
    )
}
