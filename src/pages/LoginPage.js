import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErrorMsg(error.message);
    else {
      setErrorMsg('');
      onLogin();
    }
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setErrorMsg(error.message);
    else setErrorMsg('Signup successful! Now log in.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded shadow-md w-96 space-y-4">
        <h2 className="text-2xl font-bold">Login to Your Inventory</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700">
          Log In
        </button>
        <button
          type="button"
          onClick={handleSignup}
          className="w-full bg-green-600 p-2 rounded hover:bg-green-700"
        >
          Sign Up
        </button>
        {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
      </form>
    </div>
  );
}
