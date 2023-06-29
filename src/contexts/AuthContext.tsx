import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from 'firebase/auth';
import useFirebase from './config';
import { useRouter } from 'next/router';
import { User } from '@/types';
import { createAppUser } from '@/helpers/api-utils';
import { User as FirebaseUser} from 'firebase/auth';

type AuthContextType = {
  token?: string
  user?: User;
  signup?: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  login?: (email: string, password: string) => Promise<void>;
  logout?: () => Promise<void>;
  loading?: boolean
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthUserProvider({ children }) {
  const firebaseApp = useFirebase();
  const auth = getAuth(firebaseApp);
  const [baseUser, setBaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState();
  const [token, setToken] = useState(null)
  const router = useRouter();
  const [loading, setLoading] = useState(false)

    // Get the auth token if none exist
    useEffect(() => {
      const getUserToken = async() => {
        if (baseUser) {
          let userToken = await baseUser.getIdToken();
          setToken(userToken)
        }
      }
      getUserToken();
    }, [baseUser]);

  // Get the backend user if not found!
  useEffect(() => {
    let userToken;
    const getUserToken = async() => {
      if (baseUser && !user) {
        userToken = await baseUser.getIdToken();
        console.log("getting user details from backend!!")
        const fetchedUser = await getUserDetails(userToken);
        setUser(fetchedUser);
        console.log("fetched user: ", fetchedUser)
      }
    }
    getUserToken();
  }, [baseUser]);

  // Route to login if no user found!
  // Set the user once they're logged in
  useEffect(() => {
    return auth.onIdTokenChanged(async (baseUser) => {
      console.log("ID Token changed.")
      if (!baseUser) {
        console.log('no token found');
        setUser(null);
        if (!['login','sign-up'].some( v => router.pathname.includes(v))) router.replace('/login');
        return;
      }
      setBaseUser(baseUser);
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    setInterval(async () => {
      console.log('refreshing token...');
      const user = auth.currentUser;
      if (user) {
      const token =  await user.getIdToken(true);
      setToken(token)
      }
    }, 10 * 60 * 1000);
  }, [auth]);

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (response) => {
        // Now create the internal user!
        const createAppUserResponse = await createAppUser(response.user['accessToken'], firstName, lastName);
        if (!createAppUserResponse.result == "ok") {
          throw new Error("Internal error")
        }
        await router.replace('/');
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.code == 'auth/email-already-in-use') alert('Error: Email already in use');
        else alert('Some error occured.  Please notify support.');
      });
  };

  const login = async (email: string, password: string) => {
    const response = await signInWithEmailAndPassword(auth, email, password);
    console.log(response)
    router.replace('/dashboards/crypto')
    return
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, signup, login, logout, loading }}>
      {/* {loading ? "Loading" : children} */}
      {children}
    </AuthContext.Provider>
  );
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(AuthContext);


async function getUserDetails(token) {

  const reqHeaders = new Headers();
  reqHeaders.append("Authorization", `Bearer ${token}`);
  reqHeaders.append("Content-Type", "application/json");

  const requestOptions = {
      method: 'GET',
      headers: reqHeaders,
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_HOST;

  let result;


  result = await fetch(`${baseUrl}/users`, requestOptions)
  .then(response => {
      if (response.ok) {
          return response.json();
      }
      return response.json().then(response => {throw new Error(response.error)});
  })
  .then((data) => {
      return data;
  })
  .catch(error => {
      console.log('Error fetching user data', error);
      return new Error(error.message);
  });

  return result;
}