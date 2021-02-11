const { Server } = require('@logux/server');

const rooms = [];

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
        return { type: 'INIT_ROOMS', rooms };
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
        rooms.push(action.room);
        return { type: 'ADD_ROOM', room: action.room };
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
        const room = rooms.filter(room => room.id === action.roomId);
        room.clients.push(newClient(action.clientId));
        return room;
    }
})

// function newRoom(id) {
//     return {
//         id,
//         clients: [],
//         noteContent: [{
//             type: 'paragraph',
//             text: 'Hello, World!'
//         }]
//     }
// }

function newClient(id) {
    return { id };
}

server.listen();