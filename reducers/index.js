import{setToken, setFirstName, setLastName} from "../constants/action-types";
const initialState = {
    token: '',
    first_name: '',
    last_name: ''
};
const rootReducer = (state = initialState, action) => {
    switch (action.type){
        case setToken:
            return{
                ...state,
             token: action.payload
            };    
        case setFirstName:
            return{
                ...state,
             first_name: action.payload
            };
        case setLastName:
            return{
                ...state,
             last_name: action.payload
            };                                   
        default:
            return state
    }
}
export default rootReducer;