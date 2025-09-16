import React, { createContext, useReducer, useEffect } from "react";
import { loginRequest, getMe } from "../api/auth";
import { setAuthHeader } from "../api/api";
import { useNavigate } from "react-router-dom";

const initialState = {
  isAuthenticated: false,
  user: null,
  access: null,
  refresh: null,
  isInitialized: false,
};

export const AuthContext = createContext(initialState);

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, ...action.payload, isInitialized: true };
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        access: action.payload.access,
        refresh: action.payload.refresh,
        user: action.payload.user,
      };
    case "LOGOUT":
      return { ...initialState, isInitialized: true };
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  // 🔹 Inicializar sesión si hay tokens guardados
  useEffect(() => {
    (async function init() {
      const access = localStorage.getItem("access");
      const refresh = localStorage.getItem("refresh");

      if (access) setAuthHeader(access);

      if (access && refresh) {
        try {
          const user = await getMe();
          dispatch({
            type: "INIT",
            payload: { isAuthenticated: true, user, access, refresh },
          });
        } catch (e) {
          console.error("Fallo al inicializar sesión:", e);
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setAuthHeader(null);
          dispatch({ type: "INIT", payload: { isAuthenticated: false } });
        }
      } else {
        dispatch({ type: "INIT", payload: { isAuthenticated: false } });
      }
    })();
  }, []);
// LOGS PARA DEBUG
  useEffect(() => {
  (async function init() {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    console.log("[INIT] Tokens encontrados:", { access, refresh });

    if (access) setAuthHeader(access);

    if (access && refresh) {
      try {
        const user = await getMe();
        console.log("[INIT] Usuario cargado:", user);
        dispatch({
          type: "INIT",
          payload: { isAuthenticated: true, user, access, refresh },
        });
      } catch (e) {
        console.error("[INIT] Error al cargar perfil:", e);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setAuthHeader(null);
        dispatch({ type: "INIT", payload: { isAuthenticated: false } });
      }
    } else {
      console.log("[INIT] No había tokens guardados");
      dispatch({ type: "INIT", payload: { isAuthenticated: false } });
    }
  })();
}, []);


  // 🔹 Login
  const login = async (username, password) => {
    const tokens = await loginRequest(username, password);

    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    setAuthHeader(tokens.access);

    const user = await getMe();
    dispatch({
      type: "LOGIN",
      payload: { access: tokens.access, refresh: tokens.refresh, user },
    });

    // navegar después de actualizar estado
    setTimeout(() => navigate("/"), 0);
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAuthHeader(null);
    dispatch({ type: "LOGOUT" });
    navigate("/login", { replace: true });
  };

  // 🔹 Refrescar perfil
  const refreshUser = async () => {
    try {
      const user = await getMe();
      dispatch({ type: "SET_USER", payload: user });
    } catch (e) {
      console.error("No se pudo refrescar el perfil:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
