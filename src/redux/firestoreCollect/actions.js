import { getDocs, collection } from "firebase/firestore/lite";

import { fireStore } from "../../firebase/firebase.utils";

export const fetchCollectionsStart = () => ({
  type: "FS_COLLECTIONS_START",
});

export const fetchCollectionsSuccess = (collectionsMap) => ({
  type: "FS_COLLECTIONS_SUCCESS",
  payload: collectionsMap,
});

export const fetchCollectionsFailure = (errorMessage) => ({
  type: "FS_COLLECTIONS_FAILURE",
  payload: errorMessage,
});

export const fetchFirestoreAsync = () => {
  return (dispatch) => {
    const collectionRef = collection(fireStore, "collections");

    getDocs(collectionRef)
      .then((snapshot) => {
        let col = snapshot.docs.map((doc) => doc.data());
        dispatch(fetchCollectionsSuccess(col));
      })
      .catch((error) => dispatch(fetchCollectionsFailure(error.message)));
  };
};
