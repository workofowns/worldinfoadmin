// src/firebase/firebaseHelpers.js
import { collection, deleteField, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export const fetchDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("Document not found");
    }
  } catch (err) {
    console.error("Error fetching document:", err);
    throw err;
  }
};

export const fetchCollection = async (collectionName) => {
  console.log("Fetching collection:", collectionName);
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.table("Error fetching collection:", err);
    throw err;
  }
};

export const deleteFromDocument = async (collection, docId, key) => {
  const docRef = doc(db, collection, docId);
  await updateDoc(docRef, { [key]: deleteField() });
};

export const updateDocument = async (collection, docName, data) => {
  const ref = doc(db, collection, docName);
  // setDoc with merge: true will create or update
  await setDoc(ref, data, { merge: true });
};

/**
 * Add new fields to document without overwriting others
 * Internally uses setDoc merge too
 */
export const addToDocument = async (collection, docName, newData) => {
  const ref = doc(db, collection, docName);
  await setDoc(ref, newData, { merge: true });
};
