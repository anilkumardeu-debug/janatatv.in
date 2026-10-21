import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit as firestoreLimit, 
  increment 
} from 'firebase/firestore';
import { firestoreDb } from './firebaseConfig';

const ARTICLES_COLLECTION = 'articles';
const SETTINGS_COLLECTION = 'settings';

export async function fetchArticlesFromFirestore({ category = 'All', limit = 50 } = {}) {
  if (!firestoreDb) return null;
  try {
    const colRef = collection(firestoreDb, ARTICLES_COLLECTION);
    let snapshot;
    try {
      const q = query(colRef, orderBy('publishedAt', 'desc'), firestoreLimit(limit));
      snapshot = await getDocs(q);
    } catch (queryErr) {
      const q = query(colRef, firestoreLimit(limit));
      snapshot = await getDocs(q);
    }

    if (!snapshot || snapshot.empty) return null;

    let articles = [];
    snapshot.forEach(docSnap => {
      articles.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Always sort newest first
    articles.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

    if (category && category !== 'All') {
      articles = articles.filter(a => a.category?.toLowerCase() === category.toLowerCase());
    }

    return articles;
  } catch (err) {
    console.warn('[Firestore] Read error or database not yet created:', err.message);
    return null;
  }
}

export async function saveArticleToFirestore(article) {
  if (!firestoreDb || !article?.id) return null;
  try {
    const docRef = doc(firestoreDb, ARTICLES_COLLECTION, article.id);
    await setDoc(docRef, article, { merge: true });
    return article;
  } catch (err) {
    console.warn('[Firestore] Save error:', err.message);
    return null;
  }
}

export async function updateArticleInFirestore(id, updates) {
  if (!firestoreDb || !id) return null;
  try {
    const docRef = doc(firestoreDb, ARTICLES_COLLECTION, id);
    await updateDoc(docRef, updates);
    return true;
  } catch (err) {
    console.warn('[Firestore] Update error:', err.message);
    return null;
  }
}

export async function deleteArticleFromFirestore(id) {
  if (!firestoreDb || !id) return false;
  try {
    const docRef = doc(firestoreDb, ARTICLES_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('[Firestore] Delete error:', err.message);
    return false;
  }
}

export async function incrementReactionInFirestore(id, reactionType) {
  if (!firestoreDb || !id) return null;
  try {
    const docRef = doc(firestoreDb, ARTICLES_COLLECTION, id);
    await updateDoc(docRef, {
      [`reactions.${reactionType}`]: increment(1)
    });
    return true;
  } catch (err) {
    console.warn('[Firestore] Reaction error:', err.message);
    return null;
  }
}
