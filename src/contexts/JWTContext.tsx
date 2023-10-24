import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/reducers/actions';
import authReducer from 'store/reducers/auth';

// project import
import Loader from 'components/Loader';
import salutations from 'data/salutations';
import userTypes from 'data/userTypes';
import { AuthProps, JWTContextType } from 'types/auth';
import { KeyedObject } from 'types/root';
import axios, { axiosServices } from 'utils/axios';

const chance = new Chance();

// constant
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken: (st: string) => boolean = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded: KeyedObject = jwtDecode(serviceToken);
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken?: string | null) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          axiosServices.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
          const response = await axiosServices.get('/api/User/GetCurrentUser');

          // const { user } = response.data;

          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                id: response.data.id,
                email: response.data.email,
                name: `${salutations.find(salutation => salutation.id == response.data.salutation)?.description || "-"} ${response.data.firstName} ${response.data.lastName}`,
                role: userTypes.find(userType => userType.id == response.data.userType)?.description || "-"
              }
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/account/login', { email, password });
    const { serviceToken, user } = response.data;
    setSession(serviceToken);
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user
      }
    });
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    // todo: this flow need to be recode as it not verified
    const id = chance.bb_pin();
    const response = await axios.post('/api/account/register', {
      id,
      email,
      password,
      firstName,
      lastName
    });
    let users = response.data;

    if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      users = [
        ...JSON.parse(localUsers!),
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`
        }
      ];
    }

    window.localStorage.setItem('users', JSON.stringify(users));
  };

  const signIn = async (nic: string, password: string) => {
    const response = await axiosServices.post('/api/User/SignIn', { nic, password });

    const { token, userDetails } = response.data;
    setSession(token);
    axiosServices.defaults.headers.common.Authorization = `Bearer ${token}`;
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user: {
          id: userDetails.id,
          email: userDetails.email,
          name: `${salutations.find(salutation => salutation.id == userDetails.salutation)?.description || "-"} ${userDetails.firstName} ${userDetails.lastName}`,
          role: userTypes.find(userType => userType.id == userDetails.userType)?.description || "-"
        }
      }
    });
  };

  const signUp = async (nic: string, email: string, password: string, userType: number, salutation: number, firstName: string, lastName: string, contactNumber: string, confirmPassword: string) => {

    const response = await axiosServices.post('/api/User/SignUp', {
      salutation,
      firstName,
      lastName,
      contactNumber,
      email,
      nic,
      userType,
      password,
    });

    const user = response.data;

    if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      const users = [
        ...JSON.parse(localUsers!),
        {
          id: user.id,
          email: user.email,
          name: `${salutations.find(salutation => salutation.id == user.salutation)?.description || "-"} ${user.firstName} ${user.lastName}`,
          role: userTypes.find(userType => userType.id == user.userType)?.description || "-"
        }
      ];
      window.localStorage.setItem('users', JSON.stringify(users));
    } else {       
      const users = [
        {
          id: user.id,
          email: user.email,
          name: `${salutations.find(salutation => salutation.id == user.salutation)?.description || "-"} ${user.firstName} ${user.lastName}`,
          role: userTypes.find(userType => userType.id == user.userType)?.description || "-"
        }
      ];
      window.localStorage.setItem('users', JSON.stringify(users));
    }

  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (email: string) => { };

  const updateProfile = () => { };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login, logout, register, signIn, signUp, resetPassword, updateProfile }}>{children}</JWTContext.Provider>;
};

export default JWTContext;
