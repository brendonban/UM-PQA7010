"use client";
// Data access for the staff console: live Firebase, or sample data in demo mode.
import {
  getFirestore, collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc, getDocs, serverTimestamp,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getApp } from "@/lib/firebase";
import { SERVICES } from "@/lib/content";

export const STATUSES = ["New", "Contacted", "Assigned", "In sessions", "Closed"];

export function liveStore() {
  const app = getApp();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const list = async (name, field) => {
    const s = await getDocs(query(collection(db, name), orderBy(field, field === "date" ? "desc" : "asc")));
    return s.docs.map((d) => ({ id: d.id, ...d.data() }));
  };
  return {
    demo: false,
    async signIn() {
      const p = new GoogleAuthProvider();
      p.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, p);
    },
    signOut: () => signOut(auth),
    onUser: (cb) => onAuthStateChanged(auth, cb),
    watchRegs: (cb, onErr) =>
      onSnapshot(query(collection(db, "registrations"), orderBy("createdAt", "desc")),
        (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() }))), onErr),
    updateReg: (id, data) => updateDoc(doc(db, "registrations", id), { ...data, updatedAt: serverTimestamp() }),
    loadTrainees: () => list("trainees", "order"),
    async saveTrainee(id, data) { id ? await updateDoc(doc(db, "trainees", id), data) : await addDoc(collection(db, "trainees"), data); return list("trainees", "order"); },
    async deleteTrainee(id) { await deleteDoc(doc(db, "trainees", id)); return list("trainees", "order"); },
    loadEvents: () => list("events", "date"),
    async saveEvent(id, data) { id ? await updateDoc(doc(db, "events", id), data) : await addDoc(collection(db, "events"), data); return list("events", "date"); },
    async deleteEvent(id) { await deleteDoc(doc(db, "events", id)); return list("events", "date"); },
  };
}

export function demoStore() {
  const names = ["Aina", "Daniel", "Mei Ling", "Kavitha", "Hafiz", "Sarah", "Arjun", "Nurul", "Jason", "Farah", "Wei Jie"];
  let trainees = names.map((n, i) => ({
    id: "t" + i, name: n + " (sample)", interests: "anxiety, relationships", approach: "Person-centred",
    languages: "English, Bahasa Melayu", bio: "Sample introduction.", photo: "", whatsapp: "", telegram: "", email: "", order: i + 1, active: true,
  }));
  const types = ["UM student", "UM staff", "Member of the public"];
  const who = ["Siti A.", "Kumar R.", "Tan K. L.", "Amir H.", "Grace L.", "Priya S.", "Lim C. Y.", "Zul F.", "Hannah W."];
  let regs = who.map((name, i) => ({
    id: "r" + i, name, phone: `01${2 + i}-345 67${10 + i}`, email: i % 3 ? "" : `sample${i}@email.com`, age: 19 + i * 3,
    clientType: types[i % 3], service: SERVICES[i % 4].name, language: i % 2 ? "Bahasa Melayu" : "English",
    time: ["Any time", "Weekday morning", "Weekend"][i % 3], preferredCounselor: i % 2 ? trainees[i].name : "No preference",
    concern: i % 2 ? "Exam stress and trouble sleeping." : "", consent: true, status: STATUSES[i % 5],
    assignedTo: i % 5 > 1 ? trainees[i].name : "", notes: "", createdAt: new Date(Date.now() - i * 18e6),
  }));
  const dd = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
  let events = [
    { id: "e1", title: "Managing Exam Stress Workshop (sample)", date: dd(12), startTime: "10:00", endTime: "12:00", location: "Counseling Lab, Level 03, Menara Pendidikan", description: "Practical tips to stay calm during exams.", link: "", image: "", published: true },
    { id: "e2", title: "Mindful Monday (sample)", date: dd(26), startTime: "13:00", endTime: "14:00", location: "Faculty of Education", description: "A short guided mindfulness session.", link: "", image: "", published: false },
    { id: "e3", title: "World Mental Health Day Talk (sample)", date: dd(-30), startTime: "14:30", endTime: "16:00", location: "Faculty of Education", description: "", link: "", image: "", published: true },
  ];
  let regListener = () => {};
  const upsert = (arr, id, data, prefix) => id ? arr.map((x) => (x.id === id ? { ...x, ...data } : x)) : [...arr, { id: prefix + Date.now(), ...data }];
  return {
    demo: true,
    async signIn() {},
    async signOut() { window.location.href = "/admin"; },
    onUser(cb) { cb({ email: "demo@um.edu.my" }); return () => {}; },
    watchRegs(cb) { regListener = cb; cb(regs); return () => {}; },
    async updateReg(id, data) { regs = regs.map((r) => (r.id === id ? { ...r, ...data } : r)); regListener(regs); },
    async loadTrainees() { return trainees; },
    async saveTrainee(id, data) { trainees = upsert(trainees, id, data, "t"); return trainees; },
    async deleteTrainee(id) { trainees = trainees.filter((t) => t.id !== id); return trainees; },
    async loadEvents() { return events; },
    async saveEvent(id, data) { events = upsert(events, id, data, "e"); return events; },
    async deleteEvent(id) { events = events.filter((e) => e.id !== id); return events; },
  };
}
