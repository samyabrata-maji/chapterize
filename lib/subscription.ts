import { firestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function isSubscriptionActive(uid: string) {
    const licenseRef = doc(firestore, "license", uid)
    const snapshot = await getDoc(licenseRef)

    if (snapshot.exists()) {
        const user = snapshot.data()
        return user.variantId && user.currentPeriodEnd && (Date.parse(user.currentPeriodEnd) + 86_400_00 > Date.now())
    }

    return false;
}

export async function isSubscriptionCancelled(uid: string) {
    const licenseRef = doc(firestore, "license", uid)
    const snapshot = await getDoc(licenseRef)

    if (!snapshot.exists()) {
        return false
    }

    const user = snapshot.data()
    return user.isSubscriptionCancelled
}

export async function getSubscriptionId(uid: string) {
    const licenseRef = doc(firestore, "license", uid)
    const snapshot = await getDoc(licenseRef)

    if (!snapshot.exists()) {
        return false
    }

    const user = snapshot.data()
    return user.subscriptionId
}