const posDict = {
    col: {
        'A': 0,
        'B': 1,
        'C': 2,
        'D': 3,
        'E': 4,
        'F': 5,
        'G': 6,
        'H': 7,
    },
    raw: {
        8: 0,
        7: 1,
        6: 2,
        5: 3,
        4: 4,
        3: 5,
        2: 6,
        1: 7,
    },
};

const posDictRev = {
    col: {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D',
        4: 'E',
        5: 'F',
        6: 'G',
        7: 'H',
    },
    raw: {
        0: 8,
        1: 7,
        2: 6,
        3: 5,
        4: 4,
        5: 3,
        6: 2,
        7: 1,
    },
};

const gameStatues = {
    waiting: 'waiting',
    playing: 'playing',
};

const newGameState =  {
    status: gameStatues.waiting,
    turnPlayer: 'white',
    myColor: 'white',
    selectedFigure: null,
    figures: {
        white: {
            "A1": "rook",
            "B1": "knight",
            "C1": "bishop",
            "D1": "queen",
            "E1": "king",
            "F1": "bishop",
            "G1": "knight",
            "H1": "rook",
            "A2": "pawn",
            "B2": "pawn",
            "C2": "pawn",
            "D2": "pawn",
            "E2": "pawn",
            "F2": "pawn",
            "G2": "pawn",
            "H2": "pawn",
        },
        black: {
            "A8": "rook",
            "H8": "rook",
            "B8": "knight",
            "G8": "knight",
            "C8": "bishop",
            "F8": "bishop",
            "D8": "queen",
            "E8": "king",
            "A7": "pawn",
            "B7": "pawn",
            "C7": "pawn",
            "D7": "pawn",
            "E7": "pawn",
            "F7": "pawn",
            "G7": "pawn",
            "H7": "pawn",
        },
    },
};

const playersColors = {
    white: 'white',
    black: 'black'
}

const figures = {
    "rook": "rook",
    "knight": "knight",
    "bishop": "bishop",
    "queen": "queen",
    "king": "king",
    "pawn": "pawn",
};

export {
    posDict,
    posDictRev,
    newGameState,
    gameStatues,
    figures,
    playersColors
}