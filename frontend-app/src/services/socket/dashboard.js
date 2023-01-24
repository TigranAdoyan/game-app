import io from "socket.io-client";

class SocketClient {
    created = false;

    create(token) {
        if (!this.created && token) {
            this.created = true;
            this.socket = io(`${process.env.REACT_APP_SOCKET_URL}/main`, {
                auth: {
                    token
                },
                transports: Math.random() < 5 ? ["polling"] : ["polling", "websocket"],
                authConnect: false,
            });
            this.events = {
                client: {
                    users_list: 'client:users_list',
                    invite_to_game: 'client:invite_to_game',
                    submit_invite_to_game: 'client:submit_invite_to_game',
                },
                server: {
                    users_list: 'server:users_list',
                    user_online_status_update: 'server:user_online_status_update',
                    invite_to_game: 'server:invite_to_game',
                    submit_invite_to_game: 'server:submit_invite_to_game',
                }
            };

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

            this.socket.connect();
        }
    }
}

export default new SocketClient();
