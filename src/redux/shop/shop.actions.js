import { getDocs, collection } from "firebase/firestore/lite";
import ShopActionTypes from "./shop.types";

import {
  fireStore,
  convertCollectionsSnapshotToMap,
} from "../../firebase/firebase.utils";

export const fetchCollectionsStart = () => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_START,
});

export const fetchCollectionsSuccess = (collectionsMap) => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_SUCCESS,
  payload: collectionsMap,
});

export const fetchCollectionsFailure = (errorMessage) => ({
  type: ShopActionTypes.FETCH_COLLECTIONS_FAILURE,
  payload: errorMessage,
});

export const fetchCollectionsStartAsync = () => {
  return async (dispatch) => {
    const collectionRef = collection(fireStore, "collections");

    dispatch(fetchCollectionsStart());

    try {
      let snap = await getDocs(collectionRef);
      const mapObj = convertCollectionsSnapshotToMap(snap);

      dispatch(fetchCollectionsSuccess(mapObj));
    } catch (error) {
      dispatch(fetchCollectionsFailure(error.message));
    }
  };
};
