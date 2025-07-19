import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function IndexPage() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) console.error('Error fetching role:', error);
        else setRole(data.role);
      }
    };

    fetchUserAndRole();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center space-y-6 p-6">
      <h1 className="text-4xl font-bold">🧭 D&D Campaign Portal</h1>
      <p className="text-lg text-gray-300">Welcome to your custom player + DM site!</p>

      <div className="space-x-4">
        <button
          onClick={() => navigate('/inventory')}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          🧾 Player Inventory
        </button>

        {role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            🧙 Admin Dashboard
          </button>
        )}

        <button
          onClick={() => navigate('/map')}
          className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
        >
          🗺️ Explore the Map
        </button>
      </div>

      {user ? (
        <div className="mt-6 space-y-2 text-center">
          <p className="text-sm text-gray-400">Logged in as: {user.email}</p>
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 underline hover:text-red-300"
          >
            Log Out
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="text-sm text-gray-400 underline hover:text-white mt-6"
        >
          Log In
        </button>
      )}
    </div>
  );
}
