import React, { ReactElement } from "react";
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
import { query, where, collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from "@firebase/firestore";
import { auth, db, storage } from "./firebase";
import { v4 as uuid } from "uuid";

interface Props {
  children:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactNodeArray
    | React.ReactPortal;
}

interface userTypes {
  displayName: string | null;
  userId: string;
  avatar?: string | null;
}

interface registrationTypes {
  displayName: string;
  email: string;
  password: string;
}

export interface savedItemInterface {
  title: string;
  summary: string;
  url: string;
  itemId: string;
}

interface contextTypes {
  loading: boolean;
  currentUser: userTypes | null;
  savedItems: savedItemInterface[];
  logInUser(email: string, password: string): Promise<void>;
  signInWithGoogle(): any;  // FIXME
  registerUser(data: registrationTypes): Promise<void>;
  updateAvatar(file: { image: Blob; ext: string }): Promise<void>;
  signOutUser(): Promise<void>;
  addSavedItem(params: { title: string; summary: string, url: string }): Promise<void>;
  updateSavedItem(params: { newTitle: string; newSummary: string; newUrl: string; id: string }): Promise<void>;
  deleteSavedItem(id: string): Promise<void>;
  getSavedItems(): Promise<void>;
  handleAuthChange: (params: { cb?: VoidFunction; err?: VoidFunction }) => void;
}

const contextDefaultVal: contextTypes = {
  loading: false,
  currentUser: null,
  savedItems: [],
  logInUser: async () => {},
  signInWithGoogle: async () => {},
  registerUser: async () => {},
  updateAvatar: async () => {},
  signOutUser: async () => {},
  addSavedItem: async () => {},
  updateSavedItem: async () => {},
  deleteSavedItem: async () => {},
  getSavedItems: async () => {},
  handleAuthChange: () => {},
};

export const AppContext = React.createContext<contextTypes>(contextDefaultVal);

export default function AppContextProvider({ children }: Props): ReactElement {
  const [currentUser, setCurrentUser] = React.useState<userTypes | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [savedItems, setSavedItems] = React.useState<savedItemInterface[]>([]);

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

  const registerUser = async (data: registrationTypes) => {
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

        // get the file url from firebase stoprage
        const image = await getDownloadURL(avatarRef.ref);

        // Update users photoURL
        await updateProfile(auth.currentUser, {
          photoURL: image,
        });

        // Reload the current user to fetch new profileUrl
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

  const addSavedItem = async (params: { title: string; summary: string, url: string }) => {
    try {
      const docRef = doc(
        db,
        "todo",
        uuid() /*unique id for new document, Note that firestore can do this for you if you leave the third parameter empty*/
      );
      const userId = auth.currentUser;
      if (userId !== null) {
        await setDoc(docRef, {
          userId: userId.uid,
          title: params.title,
          summary: params.summary,
          url: params.url
        });
      }
    } catch (error) { }
  };

  const getSavedItems = async () => {
    try {
      if (auth.currentUser !== null) {
        const userId = auth.currentUser.uid;

        const q = query(collection(db, "todo"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        // reset the saved items value
        setSavedItems([]);

        querySnapshot.forEach((doc) => {
          const {title, summary, url} = doc.data();
          setSavedItems((prev) => [
            ...prev,
            {
              itemId: doc.id,
              title,
              summary,
              url
            },
          ]);
        });
      }
    } catch (error) { }
  };

  const updateSavedItem = async (params: { id: string, newTitle: string; newSummary: string; newUrl: string }) => {
    const { id, newTitle: title, newSummary: summary, newUrl: url } = params;
    try {
      const docRef = doc(db, "todo", id);
      await updateDoc(docRef, {
        title,
        summary,
        url
      });
    } catch (error) { }
  };

  const deleteSavedItem = async (id: string) => {
    try {
      const docRef = doc(db, "todo", id);
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
        savedItems,
        addSavedItem,
        getSavedItems,
        updateSavedItem,
        deleteSavedItem,
        signOutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
