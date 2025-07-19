// --- AdminDashboard.js ---
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ItemCard from '../components/ItemCard';
import html2pdf from 'html2pdf.js';
import Fuse from 'fuse.js';

const slotIcons = [
  'head', 'back', 'hands', 'armor', 'waist', 'feet', 'ring', 'amulet', 'weapon', 'shield'
];

const getFallbackIcon = (slot) => {
  const map = {
    head: '🪖',
    back: '🎒',
    hands: '🪤',
    armor: '🛡️',
    waist: '👖',
    feet: '🪾',
    ring: '💍',
    amulet: '📿',
    weapon: '⚔️',
    shield: '🛡️'
  };
  return map[slot] || '❓';
};

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [itemPreview, setItemPreview] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [playerInventories, setPlayerInventories] = useState({});
  const [filters, setFilters] = useState({ name: '', rarity: '', type: '', slot: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
        setRole(profile?.role);
      }
      const { data: userList } = await supabase.from('user_profiles').select('id, role');
      setUsers(userList || []);
    };
    fetchUserData();
    fetchInventories();
    mergeItemData();
  }, []);

  const fetchInventories = async () => {
    const { data, error } = await supabase.from('inventory_items').select();
    if (!error && data) {
      const grouped = data.reduce((acc, item) => {
        if (!acc[item.user_id]) acc[item.user_id] = [];
        acc[item.user_id].push(item);
        return acc;
      }, {});
      setPlayerInventories(grouped);
    }
  };

  const handleDeleteItem = async (itemId) => {
    const { error } = await supabase.from('inventory_items').delete().eq('item_id', itemId);
    if (!error) fetchInventories();
  };

  const handleExportPDF = (uid) => {
  const element = document.getElementById(`inventory-${uid}`);
  const opt = {
    margin: 0.2,
    filename: `inventory-${uid}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false
    },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
};

  const handleCopyLink = (uid) => {
    const url = `${window.location.origin}/inventory/${uid}`;
    navigator.clipboard.writeText(url);
  };

  const mergeItemData = async () => {
    try {
      const [itemsRes, fluffRes, baseRes] = await Promise.all([
        fetch('/items/items.json'),
        fetch('/items/fluff-items.json'),
        fetch('/items/items-base.json'),
      ]);

      const rawItemsData = await itemsRes.json();
      const rawFluffData = await fluffRes.json();
      const rawBaseData = await baseRes.json();

      const itemsData = rawItemsData.item || [];
      const fluffData = Object.values(rawFluffData || {});
      const baseData = rawBaseData.baseitem || [];

   const items = itemsData.map((item, index) => {
    const fluff = fluffData.find((f) => f.name === item.name);
    const base = baseData.find((b) => b.name === item.name);
    return {
      id: `${item.name}-${item.type || base?.type || 'Unknown'}-${index}`,
      name: item.name,
      type: item.type || base?.type || 'Unknown',
      slot: item.equipmentCategory || base?.equipmentCategory || '',
      rarity: item.rarity || base?.rarity || 'Common',
      description:
        (fluff?.entries || item.entries || base?.entries || [])
          .join(' ') || 'No description available.',
      weight: item.weight ? `${item.weight} lb` : base?.weight ? `${base.weight} lb` : 'N/A',
      cost: item.value ? `${item.value} gp` : base?.value ? `${base.value} gp` : '—',
    };
  });

      setAllItems(items);
      setFilteredItems(items);
    } catch (e) {
      console.error('Error loading item data:', e);
    }
  };

  useEffect(() => {
    const fuse = new Fuse(allItems, { keys: ['name'], threshold: 0.3 });
    const results = filters.name ? fuse.search(filters.name).map(r => r.item) : allItems;
    const furtherFiltered = results.filter(i => (
      (!filters.rarity || i.rarity === filters.rarity) &&
      (!filters.type || i.type === filters.type) &&
      (!filters.slot || i.slot?.toLowerCase().includes(filters.slot.toLowerCase()))
    ));
    setFilteredItems(furtherFiltered);
  }, [filters, allItems]);

  const toggleSlot = (slot) => {
    setFilters(prev => ({ ...prev, slot: prev.slot === slot ? '' : slot }));
  };

  const handleAssign = async () => {
    if (!selectedUser || !itemPreview) return;
    const { error } = await supabase.from('inventory_items').insert([{
      user_id: selectedUser,
      item_id: `admin-${Date.now()}`,
      item_name: itemPreview.name,
      item_type: itemPreview.type,
      item_rarity: itemPreview.rarity,
      item_description: itemPreview.description,
      item_weight: itemPreview.weight,
      item_cost: itemPreview.cost
    }]);
    if (!error) {
      setItemPreview(null);
      fetchInventories();
    }
  };
  const rarityOptions = [...new Set(allItems.map(i => i.rarity))];
  const typeOptions = [...new Set(allItems.map(i => i.type))];
  
  if (!user || role !== 'admin') return <div className="p-6 text-red-500">Access denied.</div>;



  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">🧙 Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="p-2 rounded border bg-white text-black dark:bg-gray-800 dark:text-white"
        />
        <select
          value={filters.rarity}
          onChange={(e) => setFilters({ ...filters, rarity: e.target.value })}
          className="p-2 rounded border bg-white text-black dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Rarities</option>
          {rarityOptions.map(r => <option key={r}>{r}</option>)}
        </select>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="p-2 rounded border bg-white text-black dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Types</option>
          {typeOptions.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-3 items-center mt-4">
        {slotIcons.map(slot => (
          <button
            key={slot}
            onClick={() => toggleSlot(slot)}
            className={`p-1 border-2 rounded-full flex items-center justify-center w-10 h-10 text-xl bg-white dark:bg-gray-700 ${filters.slot === slot ? 'border-blue-500' : 'border-gray-300'}`}
            title={slot}
          >
            <img
              src={`/icons/slots/${slot}.png`}
              alt={slot}
              onError={(e) => {
                e.target.onerror = null;
                e.target.replaceWith(Object.assign(document.createElement('span'), { innerText: getFallbackIcon(slot) }));
              }}
              className="w-6 h-6"
            />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Select Item:</h3>
          <ul className="h-80 overflow-y-auto space-y-2">
			{filteredItems.map(i => (
				<li
				key={i.id}
				onClick={() => setItemPreview(i)}
				className="p-2 rounded hover:bg-gray-100 cursor-pointer border flex items-center gap-2"
				>
				{i.slot && (
					<img src={`/icons/slots/${i.slot.toLowerCase()}.png`} alt={i.slot} className="w-6 h-6" />
				)}
      <div>
        <strong>{i.name}</strong>
        <div className="text-sm text-gray-600">{i.rarity}, {i.type}, {i.slot}</div>
      </div>
    </li>
  ))}
</ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">📦 Preview</h3>
          {itemPreview ? <ItemCard item={itemPreview} /> : <p>No item selected.</p>}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">Assign to Player:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full p-2 rounded border bg-white text-black dark:bg-gray-800 dark:text-white"
        >
          <option value="">-- Select a Player --</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.id} ({u.role})</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAssign}
        disabled={!itemPreview || !selectedUser}
        className="bg-green-600 px-4 py-2 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        🎯 Assign Item to Player
      </button>

      <div>
        <h3 className="text-xl font-semibold mt-10 mb-4">📂 Player Inventories</h3>
        {Object.entries(playerInventories).map(([uid, items]) => (
          <div key={uid} className="mb-6">
            <h4 className="font-bold text-md mb-2">Player: {uid}</h4>
            <div className="flex gap-3 mb-3">
              <button onClick={() => handleExportPDF(uid)} className="text-sm px-3 py-1 rounded bg-slate-600 text-white hover:bg-slate-700">🖨 Export PDF</button>
              <button onClick={() => handleCopyLink(uid)} className="text-sm px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700">🔗 Copy Share Link</button>
            </div>
            <div id={`inventory-${uid}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(card => (
                <div key={card.item_id} className="relative">
                  <ItemCard item={card} />
                  <button
                    onClick={() => handleDeleteItem(card.item_id)}
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                  >✖</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

