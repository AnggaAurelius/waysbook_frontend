import { createContext, useReducer } from "react";

export const AppContext = createContext();

const initialState = {
  isLogin: false,
  isAdmin: false,
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUKSES":
      localStorage.setItem("token", action.payload.token);

      return {
        ...state,
        isLogin: true,
        user: {
          email: action.payload.email,
          fullName: action.payload.fullName,
          role: action.payload.role,
          avatar: action.payload.avatar,
        },
        loading: false,
      };
    case "USER_LOADED":
      return {
        ...state,
        isLogin: true,
        user: {
          email: action.payload.email,
          fullName: action.payload.fullName,
          role: action.payload.role,
          avatar: action.payload.avatar,
        },
        loading: false,
      };
    case "ADMIN":
      localStorage.setItem("token", action.payload.token);

      return {
        ...state,
        isAdmin: true,
        user: {
          emaill: action.payload.email,
          fullName: action.payload.fullName,
          role: action.payload.role,
        },
      };
    case "ADMIN_LOADED":
      return {
        ...state,
        isAdmin: true,
        user: {
          emaill: action.payload.email,
          fullName: action.payload.fullName,
          role: action.payload.role,
        },
      };
    case "AUTH_ERROR":
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        isLogin: false,
        user: {
          id: "",
          email: "",
          fullName: "",
          role: "",
        },
      };
    default:
      throw new Error();
  }
};

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  );
};
