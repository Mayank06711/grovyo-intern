import {
    FETCH_ERRORS_REQUEST,
    FETCH_ERRORS_SUCCESS,
    FETCH_ERRORS_FAILURE,
    RESOLVE_ERROR_SUCCESS,
  } from './errorAction';
  
  const initialState = {
    loading: false,
    errors: [],
    currentPage: 1,
    totalPages: 1,
    errorMsg: '',
  };
  
  const errorReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_ERRORS_REQUEST:
        return { ...state, loading: true, errorMsg: '' };
      case FETCH_ERRORS_SUCCESS:
        return {
          ...state,
          loading: false,
          errors: action.payload.data,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      case FETCH_ERRORS_FAILURE:
        return { ...state, loading: false, errorMsg: action.payload };
      case RESOLVE_ERROR_SUCCESS:
        return {
          ...state,
          errors: state.errors.filter((error) => error._id !== action.payload),
        };
      default:
        return state;
    }
  };
  
  export default errorReducer;
  