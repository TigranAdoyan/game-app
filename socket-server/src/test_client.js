const io = require("socket.io-client");
class ServerClient {
    constructor(token) {
        this.socket = io(`http://localhost:3334`, {
            auth: {
                username: "tigran",
                token
            },
            transports: Math.random() < 5 ? ["polling"] : ["polling", "websocket"],
            authConnect: false,
        });

        this.events = {
            client: {
                'sync_games_list': 'client:sync_games_list',
                'create_game': 'client:create_game',
                'join_game': 'client:join_game',
                'start_game': 'client:start_game'
            },
            server: {
                'sync_games_list': 'server:sync_games_list',
                'create_game': 'server:create_game',
                'join_game': 'server:join_game',
                'start_game': 'server:start_game',
                'session': 'server:session'
            },
        };

        if (this.socket.auth) {
            this.socket.connect();
            this.socket.emit(this.events.client.sync_games_list);
        }

        this.socket.on('connect', () => {
            console.log('socket connected');
        });
        this.socket.on('connect_error', err => {
            console.log(err)
        });
        this.socket.on('connect_failed', err => {
            console.log(err)
        });
        this.socket.on('disconnect', err => {
            console.log(err)
        });

        this.socket.on(this.events.server.session, (data = {}) => {
            this.socket.auth.sessionID = data.sessionID;
            this.socket.auth.userID = data.userID;
            this.socket.connect();
        });
    }

    syncGameList() {
        this.socket.emit(this.events.client.sync_games_list);
    }

    createGame(data) {
        this.socket.emit(this.events.client.create_game, data);
    }

    on(event, callback) {
        this.socket.on(event, callback);
    };
}

const client = new ServerClient();

client.on(client.events.server.sync_games_list, (data) => {
    console.log(`Sync game list: `, data);
});

client.createGame({
   title: 'I wont to create a game !'
});
