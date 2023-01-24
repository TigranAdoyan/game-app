import {createSlice, current} from "@reduxjs/toolkit";

const initialState = {
    id: null,
    playersIds: [],
    myData: {},
    connectedPlayers: [],
    status: '',
    defenderPlayerId: null,
    attackerPlayerId: null,
    trumpCard: null,
    cardsCount: null,
    turnCards: null
};

const gameStateSlice = createSlice({
    name: "game_state",
    initialState,
    reducers: {
        syncGameState: (state, action) => {
            state = action.payload;
            return state;
        },
        joinPlayer(state, action) {
            state.connectedPlayers[action.payload.player.id] = action.payload.player;
            return state;
        },
        startGame(state, action) {
            state.myData.state.cards = action.payload.myData.cards;
            state.attackerPlayerId = action.payload.attackerPlayerId;
            state.defenderPlayerId = action.payload.defenderPlayerId;
            state.trumpCard = action.payload.trumpCard;
            state.status = action.payload.status;
            state.cardsCount = action.payload.cardsCount;
            Object.values(state.connectedPlayers).forEach(player => player.id !== state.myData.id ? player.cardsCount = 6 : null);
            return state;
        }
    }
});

const {
    syncGameState,
    joinPlayer,
    startGame
} = gameStateSlice.actions;

export const actions = {
    syncGameState,
    joinPlayer,
    startGame
};

export default gameStateSlice;
