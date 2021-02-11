import { Node } from "slate";

export interface GlobalState {
    rooms: IRoom[]
}

export interface IRoom {
    id: string;
    clients: IClient[];
    noteContent: Node[];
}

export interface IClient {
    id: string;
}

const initialState: GlobalState = {
    rooms: []
}

export function reducer(state: GlobalState = initialState, action: any) {
    if (action.type === 'INIT_ROOMS') {
        console.log(action.rooms);
        state.rooms = action.rooms;
        return state;
    }
    if (action.type === 'ADD_ROOM') {
        state.rooms = [...state.rooms, action.room];
        return state;
    }
    if (action.type === 'REMOVE_ROOM') {
        state.rooms = state.rooms.filter(room => room.id !== action.id);
        return state;
    }
    // if (action.type === 'EDIT_NOTE') {
    //     return {
    //         ...state,
    //         noteContent: action.noteContent
    //     };
    // }
    // if (action.type === 'CHANGE_CURSOR') {
    //     const { cursors } = state;
    //     cursors[action.cursor.userId] = { ...action.cursor };
    //     return {
    //         ...state,
    //         cursors: cursors
    //     };
    // }
    return state;
}