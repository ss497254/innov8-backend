import {
    FieldPath,
    getFirestore,
    WhereFilterOp,
} from "firebase-admin/firestore";
import { FirebaseInstance } from "./setup";

const firestore = getFirestore(FirebaseInstance);

// Collection operations
export const getCollections = async () => {
    return (await firestore.listCollections()).map((doc) => doc.id);
};

export const deleteCollection = (collectionName: string) => {
    return firestore.recursiveDelete(firestore.collection(collectionName));
};

export const getCollectionData = async (collectionName: string) => {
    return (await firestore.collection(collectionName).get()).docs.map(
        (doc) => ({ ...doc.data(), id: doc.id })
    );
};

export const getItems = async (
    collectionName: string,
    filter: FirebaseFirestore.Filter
) => {
    return (
        await firestore.collection(collectionName).where(filter).get()
    ).docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

export const getItem = async (
    collectionName: string,
    fieldPath: string | FieldPath,
    opStr: WhereFilterOp,
    value: any
) => {
    return (
        await firestore
            .collection(collectionName)
            .where(fieldPath, opStr, value)
            .get()
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getItemById = async (collectionName: string, docId: string) => {
    return (await firestore.collection(collectionName).doc(docId).get()).data();
};

export const addItemWithId = async (
    collectionName: string,
    id: string,
    data: any
) => {
    return await firestore.collection(collectionName).doc(id).create(data);
};

export const addItem = async (collectionName: string, data: any) => {
    return await firestore.collection(collectionName).add(data);
};

export const updateItem = () => {
    // return firestore.send(());
};

export const deleteItem = () => {
    // return firestore.send(());
};
