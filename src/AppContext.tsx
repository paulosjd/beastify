import React, { ReactElement, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider
} from "@firebase/auth";
import { FirebaseError } from "@firebase/app";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import {
  query,
  where,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp
} from "@firebase/firestore";
import { auth, db, storage } from "./firebase";
import { v4 as uuid } from "uuid";
import {
  ArticleType,
  FilterParamsType,
  SavedArticleType,
  LogItemNotesType,
  SavedLogItemNotesType,
  NotesByLogItemKeyType
} from "./lib/types";

interface Props {
  children:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactNodeArray
    | React.ReactPortal;
}

interface UserType {
  displayName: string | null;
  userId: string;
  avatar?: string | null;
}

interface RegistrationType {
  displayName: string;
  email: string;
  password: string;
}

interface EditedArticleType {
  id: string;
  newTitle: string;
  newSummary: string;
  newUrl: string;
  newKeywords: string[];
}

interface contextTypes {
  loading: boolean;
  currentUser: UserType | null;
  savedArticles: SavedArticleType[];
  logItemNotes: NotesByLogItemKeyType;
  logInUser(email: string, password: string): Promise<void>;
  signInWithGoogle(): Promise<void>;
  registerUser(data: RegistrationType): Promise<void>;
  updateAvatar(file: { image: Blob; ext: string }): Promise<void>;
  signOutUser(): Promise<void>;
  addArticle(params: ArticleType): Promise<void>;
  updateSavedArticle(params: EditedArticleType): Promise<void>;
  deleteSavedArticle(id: string): Promise<void>;
  getSavedArticles(filterParams?: FilterParamsType): Promise<void>;
  addLogItemNotes(params: LogItemNotesType): Promise<void>;
  updateLogItemNotes(params: SavedLogItemNotesType): Promise<void>;
  deleteLogItemNotes(id: string): Promise<void>;
  getLogItemNotes(): Promise<void>;
  handleAuthChange: (params: { cb?: VoidFunction; err?: VoidFunction }) => void;
}

const contextDefaultVal: contextTypes = {
  loading: false,
  currentUser: null,
  savedArticles: [],
  logItemNotes: {},
  logInUser: async () => {},
  signInWithGoogle: async () => {},
  registerUser: async () => {},
  updateAvatar: async () => {},
  signOutUser: async () => {},
  addArticle: async () => {},
  updateSavedArticle: async () => {},
  deleteSavedArticle: async () => {},
  getSavedArticles: async () => {},
  addLogItemNotes: async () => {},
  updateLogItemNotes: async () => {},
  deleteLogItemNotes: async () => {},
  getLogItemNotes: async () => {},
  handleAuthChange: () => {},
};

export const AppContext = React.createContext<contextTypes>(contextDefaultVal);

export default function AppContextProvider({ children }: Props): ReactElement {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedArticles, setSavedArticles] = useState<SavedArticleType[]>([]);
  const [savedLogItemNotes, setSavedLogItemNotes] = useState<NotesByLogItemKeyType>({});

  const logInUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = error.message;
        const email = error.customData?.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      }
    }
  }

  const registerUser = async (data: RegistrationType) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password).then(async ({ user }) => {
        await updateProfile(user, {
          displayName: data.displayName,
        });
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async (file: { image: Blob; ext: string }) => {
    try {
      if (auth.currentUser !== null) {
        const uploadRef = ref(storage, `profileImages/${auth.currentUser.uid}-${uuid()}.${file.ext}`);

        const avatarRef = await uploadBytes(uploadRef, file.image);

        // get the file url from firebase storage
        const image = await getDownloadURL(avatarRef.ref);

        // Update users photoURL
        await updateProfile(auth.currentUser, {
          photoURL: image,
        });

        await auth.currentUser.reload();
      }
    } catch (error) { }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) { }
  };

  const handleAuthChange = async (params: { cb?: VoidFunction; err?: VoidFunction }) => {
    onAuthStateChanged(auth, (user) => {
      if (user === null) {
        setCurrentUser(null);
        params.err && params.err();
      } else {
        setCurrentUser({
          displayName: user.displayName,
          userId: user.uid,
          avatar: user.photoURL,
        });
        params.cb && params.cb();
      }
    });
  };

  const addLogItemNotes = async (params: LogItemNotesType) => {
    try {
      const docRef = doc(
        db,
        "logItem",
        uuid() /*unique id for new document, n.b.firestore can do this for you if you leave the third parameter empty*/
      );
      const userId = auth.currentUser;
      if (userId !== null) {
        await setDoc(docRef, {
          userId: userId.uid,
          logItemId: params.logItemId,
          notes: params.notes
        });
      }
    } catch (error) { }
  };

  const getLogItemNotes = async () => {
    try {
      if (auth.currentUser !== null) {
        const userId = auth.currentUser.uid;
        const q = query(
            collection(db, "logItem"),
            where("userId", "==", userId)
          );

        // reset the saved items value
        setSavedLogItemNotes({});
        const notesCollection: SavedLogItemNotesType[] = [];

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const { logItemId, notes } = doc.data();
          notesCollection.push({
            id: doc.id,
            logItemId,
            notes
          });
        });
        const notesByLogItemId = notesCollection.reduce((acc, obj) => {
          const { logItemId, id, notes } = obj;
          return {
            ...acc,
            [logItemId]: { id, notes }
          }
        }, {})
        setSavedLogItemNotes(notesByLogItemId);
      }
    } catch (error) { console.log(error) }
  };

  const updateLogItemNotes = async (
    params: SavedLogItemNotesType
  ) => {
    const { id, logItemId, notes } = params;
    try {
      const docRef = doc(db, "logItem", id);
      await updateDoc(docRef, {
        id,
        logItemId,
        notes
      });
    } catch (error) { }
  };

  const deleteLogItemNotes = async (id: string) => {
    try {
      const docRef = doc(db, "logItem", id);
      await deleteDoc(docRef);
    } catch (error) { }
  };

  const addArticle = async (params: ArticleType) => {
    try {
      const docRef = doc(
        db,
        "article",
        uuid() /*unique id for new document, n.b.firestore can do this for you if you leave the third parameter empty*/
      );
      const userId = auth.currentUser;
      if (userId !== null) {
        await setDoc(docRef, {
          userId: userId.uid,
          title: params.title,
          summary: params.summary,
          url: params.url,
          keywords: params.keywords,
          created: serverTimestamp()
        });
      }
    } catch (error) { }
  };

  const getSavedArticles = async (filterParams?: FilterParamsType) => {
    try {
      if (auth.currentUser !== null) {
        const userId = auth.currentUser.uid;
        let q
        if (filterParams?.keyword) {
          q = query(
            collection(db, "article"),
            where("userId", "==", userId),
            where("keywords", "array-contains-any", [filterParams.keyword]));
        } else if (filterParams?.startDate && filterParams?.endDate) {
          q = query(
            collection(db, "article"),
            where("userId", "==", userId),
            where('created', '>=', filterParams.startDate.toDate()),
            where('created', '<', filterParams.endDate.toDate()));
        } else if (filterParams?.startDate) {
          q = query(
            collection(db, "article"),
            where("userId", "==", userId),
            where('created', '>=', filterParams.startDate.toDate()));
        } else if (filterParams?.endDate) {
          q = query(
            collection(db, "article"),
            where("userId", "==", userId),
            where('created', '<', filterParams.endDate.toDate()));
        } else {
          q = query(
            collection(db, "article"),
            where("userId", "==", userId)
          );
        }
        const querySnapshot = await getDocs(q);

        // reset the saved items value
        setSavedArticles([]);

        querySnapshot.forEach((doc) => {
          const { title, summary, url, keywords } = doc.data();
          setSavedArticles((prev) => [
            ...prev,
            {
              itemId: doc.id,
              title,
              summary,
              url,
              keywords
            },
          ]);
        });
      }
    } catch (error) { console.log(error) }
  };

  const updateSavedArticle = async (
    params: { id: string, newTitle: string; newSummary: string; newUrl: string, newKeywords: string[] }
  ) => {
    const { id, newTitle: title, newSummary: summary, newUrl: url, newKeywords: keywords } = params;
    try {
      const docRef = doc(db, "article", id);
      await updateDoc(docRef, {
        title,
        summary,
        url,
        keywords
      });
    } catch (error) { }
  };

  const deleteSavedArticle = async (id: string) => {
    try {
      const docRef = doc(db, "article", id);
      await deleteDoc(docRef);
    } catch (error) { }
  };

  return (
    <AppContext.Provider
      value={{
        loading,
        currentUser,
        logInUser,
        signInWithGoogle,
        registerUser,
        handleAuthChange,
        updateAvatar,
        savedArticles,
        addArticle,
        getSavedArticles,
        updateSavedArticle,
        deleteSavedArticle,
        signOutUser,
        logItemNotes: savedLogItemNotes,
        addLogItemNotes,
        getLogItemNotes,
        updateLogItemNotes,
        deleteLogItemNotes
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
