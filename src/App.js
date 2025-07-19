import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import InventoryGrid from './components/InventoryGrid';
import AdminDashboard from './pages/AdminDashboard';
import Map from './Map'; // or wherever your map lives

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);

      if (session) {
        const { user } = session;
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) console.error('Role fetch error:', error);
        else setRole(data.role);
      }
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setRole(data?.role ?? null));
      } else {
        setRole(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/login" element={<LoginPage onLogin={() => navigate('/')} />} />
      <Route
        path="/inventory"
        element={session ? <InventoryGrid /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin"
        element={
          session && role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />
        }
      />
      <Route
        path="/map"
        element={session ? <Map /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
