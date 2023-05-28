import { ServiceAccount } from "firebase-admin";
import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getEnvConfig } from "../config";

export let FirebaseInstance: App;

const serviceAccount: ServiceAccount = {
    clientEmail: getEnvConfig("FIREBASE_CLIENT_EMAIL"),
    projectId: getEnvConfig("FIREBASE_PROJECT_ID"),
    privateKey: getEnvConfig("FIREBASE_PRIVATE_KEY")
        .split(String.raw`\n`)
        .join("\n"),
};

export const InitializeFirebase = async () => {
    const apps = getApps();

    if (apps.length === 0) {
        apps.push(
            initializeApp({ credential: cert(serviceAccount) }, "innov8")
        );
    }

    FirebaseInstance = apps[0];
};

export const TestFirebase = async () => {
    await getFirestore(FirebaseInstance).listCollections();

    console.log("Firebase connected successfullly.");
};
