import { combineReducers } from 'redux'

import LoaderReducer from './loader.reducer'
import AuthReducer from './auth.reducer';
const allReducers = {
    loader: LoaderReducer,
    auth: AuthReducer,
}
const rootReducer = combineReducers(allReducers);

export default rootReducer;
