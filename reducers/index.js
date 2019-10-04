import{setToken} from "../constants/action-types";
const initialState = {
    token: '',
};
const rootReducer = (state = initialState, action) => {
    switch (action.type){
        case setToken:
            return{
                ...state,
             token: action.payload
            };                          
        default:
            return state
    }
}
export default rootReducer;