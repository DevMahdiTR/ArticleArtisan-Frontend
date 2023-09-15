import { LoaderTypes } from "../types";

const initialState = {
    status: false,
}


const LoaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case LoaderTypes.TOGGLE_LOADER:
            return {
                ...state,
                status: action.payload,
            }
        default:return state;
    }
}

export default LoaderReducer;