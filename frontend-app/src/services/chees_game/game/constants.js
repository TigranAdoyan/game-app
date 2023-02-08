const colValDict = {
    'A': 1,
    'B': 2,
    'C': 3,
    'D': 4,
    'E': 5,
    'F': 6,
    'G': 7,
    'H': 8,
};

const colValDictRev = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F',
    7: 'G',
    8: 'H',
};

const gameStatues = {
    waiting: 'waiting',
    playing: 'playing',
};

const newGameState = {
    status: gameStatues.waiting,
    turnPlayer: 'white',
    myColor: 'white',
    selectedFigure: null,
    figures: [
        "A1RW",
        "B1kW",
        "C1BW",
        "D1QW",
        "E1KW",
        "F1BW",
        "G1kW",
        "H1RW",
        "A2PW",
        "B2PW",
        "C2PW",
        "D2PW",
        "E2PW",
        "F2PW",
        "G2PW",
        "H2PW",
        "A7RB",
        "B7kB",
        "C7BB",
        "D7KB",
        "E7QB",
        "F7BB",
        "G7kB",
        "H7RB",
        "A8PB",
        "B8PB",
        "C8PB",
        "D8PB",
        "E8PB",
        "F8PB",
        "G8PB",
        "H8PB",
    ],
};

const players = {
    white: 'white',
    black: 'black'
}

const playersDict = {
    "W": players.white,
    "B": players.black
};

const figures = {
    "rook": "rook",
    "knight": "knight",
    "bishop": "bishop",
    "queen": "queen",
    "king": "king",
    "pawn": "pawn",
};

const figuresDict = {
    "R": figures.rook,
    "k": figures.knight,
    "B": figures.bishop,
    "Q": figures.queen,
    "K": figures.king,
    "P": figures.pawn,
};

const events = {
  check_figure: "check_figure",
  move_figure: "move_figure",
};

export {
    colValDict,
    colValDictRev,
    newGameState,
    gameStatues,
    figures,
    players,
    playersDict,
    figuresDict,
    events
}