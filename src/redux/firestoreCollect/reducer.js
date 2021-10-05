const INITIAL_STATE = {
  collections: null,
  isFetching: false,
  errorMessage: undefined,
};

const firestoreReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FS_COLLECTIONS_START":
      return {
        ...state,
        isFetching: true,
      };
    case "FS_COLLECTIONS_SUCCESS":
      return {
        ...state,
        isFetching: false,
        collections: action.payload,
      };
    case "FS_COLLECTIONS_FAILURE":
      return {
        collections: null,
        isFetching: false,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

export default firestoreReducer;
