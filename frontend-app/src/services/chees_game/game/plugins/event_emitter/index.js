class EventEmitter {
    constructor() {
        this.eventsListeners = {};
    }

    on(event, cb) {
        if (Array.isArray(this.eventsListeners[event])) this.eventsListeners[event].push(cb);
        else this.eventsListeners[event] = [cb];
    }

    emit(event, data) {
        if (Array.isArray(this.eventsListeners[event])) this.eventsListeners[event].forEach(cb => cb(data))
    }
}

export default EventEmitter;