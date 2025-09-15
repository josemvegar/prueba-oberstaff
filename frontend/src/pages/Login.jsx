import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { login } from "../api/auth";

function Login() {
  const { setToken } = useContext(AuthContext);
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username,password);
      setToken(data.access);
      // you can store refresh token and redirect
    } catch(err) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <>
      <h1>HOLA</h1>
      <form onSubmit={submit}>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Usuario"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Contraseña"/>
        <button>Login</button>
      </form>
    </>
  );
}
export default Login;
