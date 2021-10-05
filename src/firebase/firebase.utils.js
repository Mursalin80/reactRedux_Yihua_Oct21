import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDoc,
  collection,
  writeBatch,
} from "firebase/firestore/lite";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxG86V2qxq2s1dV3_ie-pLIpu7g6CvdgY",
  authDomain: "crown-db-be62b.firebaseapp.com",
  projectId: "crown-db-be62b",
  storageBucket: "crown-db-be62b.appspot.com",
  messagingSenderId: "649155163449",
  appId: "1:649155163449:web:fc13bf334e3fc577bda4e8",
};

const app = initializeApp(firebaseConfig);

export const fireStore = getFirestore(app);
export const auth = getAuth(app);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;
  const users = collection(fireStore, "users");
  // const userRef = firestore.doc(`users/${userAuth.uid}`);
  const userRef = await getDoc(`${users}/${userAuth.uid}`);

  const snapShot = await userRef.get();
  console.log("User snap: ", snapShot);

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return userRef;
};

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = collection(fireStore, collectionKey);

  const batch = writeBatch(fireStore);
  objectsToAdd.forEach((obj) => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  return await batch.commit();
};

export const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollection = collections.docs.map((doc) => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items,
    };
  });

  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

const provider = new GoogleAuthProvider();

provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => {
  try {
    signInWithPopup(auth, provider);
  } catch (error) {
    console.log("signInWithPopup Error", error.message);
  }
};

// export default firebase;
