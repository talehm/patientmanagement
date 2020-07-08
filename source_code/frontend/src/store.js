import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Reducer from './reducers/index';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

const initialState = {};
const store = createStore(Reducer, initialState, composeWithDevTools(applyMiddleware(thunk)));

export default store;
