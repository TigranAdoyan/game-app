import http from '../../server_clients/http'

class AuthService {
    constructor() {
       this.http = http;
    }

    syncAccount(cb) {
       this.http.get('/auth/data')
           .then(response => {
              cb(null, response.data)
           })
           .catch(err => cb(JSON.parse(err.request.response)));
    }

    login(data, cb) {
       this.http.post('/auth/login', data)
           .then(response => cb(null, response.data))
           .catch(err => cb(JSON.parse(err.request.response)));
    }
}

export default new AuthService()