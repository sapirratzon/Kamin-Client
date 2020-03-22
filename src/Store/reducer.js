const initialState = {
    currentUser: localStorage.getItem('currentUser'),
    token: localStorage.getItem('token')
}

const reducer = (state = initialState, action) => {
    if (action.type === 'LOGIN') {
        localStorage.setItem('currentUser', action.payload["username"]);
        localStorage.setItem('token', action.payload["token"]);
        return {
            currentUser: action.payload["username"],
            token: action.payload["token"]
        }
    }
    else if (action.type === 'LOGOUT') {
        localStorage.setItem('currentUser', '');
        localStorage.setItem('token', '');
        return {
            currentUser: "",
            token: ""
        }
    }
    return state;
};

export default reducer;