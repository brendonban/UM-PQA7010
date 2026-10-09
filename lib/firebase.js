"use client";
// Firebase connection. Settings come from environment variables (see README.md):
// on Vercel: Project → Settings → Environment Variables; locally: a .env.local file.
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore, collection, getDocs, query, orderBy, where, addDoc, serverTimestamp,
} from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseReady = Boolean(config.apiKey && config.projectId);

export function getApp() {
  if (!firebaseReady) return null;
  return getApps()[0] || initializeApp(config);
}

export function db() {
  const app = getApp();
  return app ? getFirestore(app) : null;
}

// Visible trainees in display order, or null if not connected / nothing saved yet.
export async function loadTrainees() {
  try {
    const d = db();
    if (!d) return null;
    const snap = await getDocs(query(collection(d, "trainees"), orderBy("order")));
    const list = snap.docs.map((x) => ({ id: x.id, ...x.data() })).filter((t) => t.active !== false);
    return list.length ? list : null;
  } catch (e) {
    console.warn("Could not load trainees", e);
    return null;
  }
}

// Published events (oldest first), [] if none, or null if not connected.
export async function loadEvents() {
  try {
    const d = db();
    if (!d) return null;
    const snap = await getDocs(query(collection(d, "events"), where("published", "==", true)));
    return snap.docs
      .map((x) => ({ id: x.id, ...x.data() }))
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  } catch (e) {
    console.warn("Could not load events", e);
    return null;
  }
}

export async function saveRegistration(data) {
  const d = db();
  if (!d) throw new Error("not-connected");
  await addDoc(collection(d, "registrations"), {
    ...data,
    status: "New",
    assignedTo: "",
    notes: "",
    createdAt: serverTimestamp(),
  });
}
