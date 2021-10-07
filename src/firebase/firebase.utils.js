import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDoc,
  doc,
  collection,
  writeBatch,
  setDoc,
} from "firebase/firestore/lite";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIRE_B_API_KEY,
  authDomain: process.env.REACT_APP_FIRE_B_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIRE_B_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIRE_B_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIRE_B_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIRE_B_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const fireStore = getFirestore(app);
export const auth = getAuth(app);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = doc(fireStore, "users", userAuth.uid);

  const snapShot = await getDoc(userRef);

  if (!snapShot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await setDoc(userRef, {
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return snapShot;
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
