const { Server } = require('@logux/server');

const rooms = {};

const server = new Server(
    Server.loadOptions(process, {
        subprotocol: '1.0.0',
        supports: '1.x',
        root: __dirname
    })
);

server.auth(({ userId, token }) => {
    return true;
});

server.channel('rooms', {
    access() {
        return true;
    },
    async load() {
        return rooms;
    }
});

server.type('ADD_ROOM', {
    access() {
        return true;
    },
    resend(ctx, action) {
        return { channel: `rooms` }
    },
    process(ctx, action) {
        const roomId = action.roomId;
        rooms[roomId] = newRoom(roomId);
        return { type: 'ADD_ROOM', data: rooms[roomId] };
    }
});

server.type('ADD_CLIENT', {
    access() {
        return true;
    },
    resend(ctx, action) {
        return { channel: `room/${action.roomId}` }
    },
    process(ctx, action) {
        rooms[action.roomId].clients[action.clientId] = newClient(action.clientId);
        return rooms[action.roomId];
    }
})

function newRoom(id) {
    return {
        id,
        clients: {},
        noteContent: [{
            type: 'paragraph',
            text: 'Hello, World!'
        }]
    }
}

function newClient(id) {
    return { id };
}

server.listen();