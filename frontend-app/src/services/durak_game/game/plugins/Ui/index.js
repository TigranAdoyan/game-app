import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.scss';
import Root from './Components';
import StateContext from './context';

export default class UI {
    constructor(game) {
        this.game = game;
        this.isCreated = false;
    }

    startRendering() {
        if (!this.isCreated) {
            this.isCreated = true;
            const root = ReactDOM.createRoot(document.getElementById('durak_game_ui_container'));

            root.render(
                <StateContext.Provider value={this.game.state}>
                    <Root
                      onAction={this._onAction.bind(this)}
                      getGameState={this._getGameState.bind(this)}
                    />
                </StateContext.Provider>
            );
        }
    }

    _getGameState() {
        return this.game.state;
    }

    _onAction(props) {
       if (props.action === 'collect' && [this.game.state.defenderPlayerId, this.game.state.turnPlayerId].every(id => id === this.game.state.myData.id))
           this.game.plugins.Logic.collect()
       else if (props.action === 'pass' && [this.game.state.attackerPlayerId, this.game.state.turnPlayerId].every(id => id === this.game.state.myData.id) && this.game.state.turnCards.length)
           this.game.plugins.Logic.pass()
    }
}
