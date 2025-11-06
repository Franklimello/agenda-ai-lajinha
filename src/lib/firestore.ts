// Firestore Database Helper
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  Timestamp, 
  serverTimestamp 
} from "firebase/firestore";
import { app } from "./firebase";

export const db = getFirestore(app);

// Helper para converter Timestamp do Firestore para Date
export function timestampToDate(timestamp: any): Date {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  if (timestamp?.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  return new Date(timestamp);
}

// Helper para converter Date para Timestamp do Firestore
export function dateToTimestamp(date: Date | string): Timestamp {
  if (typeof date === "string") {
    return Timestamp.fromDate(new Date(date));
  }
  return Timestamp.fromDate(date);
}

// Collections
export const COLLECTIONS = {
  users: "users",
  services: "services",
  appointments: "appointments",
  reminders: "reminders",
  subscriptions: "subscriptions",
} as const;

// Helper functions
export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar documento ${collectionName}/${docId}:`, error);
    return null;
  }
}

export async function getDocuments<T>(
  collectionName: string,
  filters?: Array<{ field: string; operator: any; value: any }>
): Promise<T[]> {
  try {
    let q = query(collection(db, collectionName));
    
    if (filters) {
      filters.forEach((filter) => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error) {
    console.error(`Erro ao buscar documentos de ${collectionName}:`, error);
    return [];
  }
}

export async function createDocument<T extends { id?: string }>(
  collectionName: string,
  data: Omit<T, "id">,
  docId?: string
): Promise<T | null> {
  try {
    const docRef = docId ? doc(db, collectionName, docId) : doc(collection(db, collectionName));
    const dataWithTimestamps = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(docRef, dataWithTimestamps);
    return { id: docRef.id, ...data } as T;
  } catch (error) {
    console.error(`Erro ao criar documento em ${collectionName}:`, error);
    return null;
  }
}

export async function updateDocument<T>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar documento ${collectionName}/${docId}:`, error);
    return false;
  }
}

export async function deleteDocument(collectionName: string, docId: string): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Erro ao deletar documento ${collectionName}/${docId}:`, error);
    return false;
  }
}

