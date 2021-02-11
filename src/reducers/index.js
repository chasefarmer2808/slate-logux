export function reducer(state, action) {
    if (action.type === 'EDIT_NOTE') {
        return {
            ...state,
            noteContent: action.noteContent
        };
    }
    if (action.type === 'CHANGE_CURSOR') {
        const { cursors } = state;
        cursors[action.cursor.userId] = { ...action.cursor };
        return {
            ...state,
            cursors: cursors
        };
    }
    return state;
}