import axios from 'axios';

export const FETCH_ERRORS_REQUEST = 'FETCH_ERRORS_REQUEST';
export const FETCH_ERRORS_SUCCESS = 'FETCH_ERRORS_SUCCESS';
export const FETCH_ERRORS_FAILURE = 'FETCH_ERRORS_FAILURE';
export const RESOLVE_ERROR_SUCCESS = 'RESOLVE_ERROR_SUCCESS';

export const fetchErrors = (page) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_ERRORS_REQUEST });
    try {
      const response = await axios.get('http://3.110.110.198:3000//error/getErrors', {
        params: { q: false, page },
      });
      dispatch({ type: FETCH_ERRORS_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_ERRORS_FAILURE, payload: error.message });
    }
  };
};

export const resolveError = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.patch(`http://3.110.110.198:3000//error/${id}`);
      if (response.status === 200) {
        dispatch({ type: RESOLVE_ERROR_SUCCESS, payload: id });
      }
    } catch (error) {
      console.error("Error resolving error:", error);
    }
  };
};
