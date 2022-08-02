import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './auth/reducers/rootReducer';
import logger from './logger';
const middleware = [thunk];
const store = createStore(
    logger(rootReducer),
    composeWithDevTools(applyMiddleware(...middleware))
);
export default store;

