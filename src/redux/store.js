import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import errorReducer from './errorReducer';

const store = createStore(
  errorReducer,
  applyMiddleware(thunk)
);

export default store;
