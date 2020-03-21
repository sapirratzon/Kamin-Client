const initialState = {
    currentUser: null,
    token: null
}

const reducer = (state = initialState, action) => {
    if (action.type === 'LOGIN') {
        console.log('test');
        return {
            currentUser: action.payload.usernamme,
            token: action.payload.token
        }
    }
    return state;
};

export default reducer;