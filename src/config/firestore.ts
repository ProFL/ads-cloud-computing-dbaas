import { ServiceAccount } from "firebase-admin";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { container } from "tsyringe";
import serviceAccount from "../../firebase-key.json";

const FIRESTORE_TOKEN = Symbol("@config/firestore");

container.register(FIRESTORE_TOKEN, {
  useFactory: () => {
    initializeApp({ credential: cert(serviceAccount as ServiceAccount) });
    return getFirestore();
  },
});

export { FIRESTORE_TOKEN };
