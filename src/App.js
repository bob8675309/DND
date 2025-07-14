import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { locationData } from './MapNpcsQuests';

import { QuestEditor } from "./QuestEditor";
import { NPCEditor } from "./NPCEditor";
import { Map } from "./Map";

const Home = () => (
  <div className="p-10 text-center">
    <h1 className="text-4xl font-bold mb-4">Welcome to the Shattered Veil</h1>
    <p className="text-lg text-gray-600">An interactive companion to your Far Realm-infused D&D campaign.</p>
  </div>
);

const Characters = () => <div className="p-10"><h2 className="text-2xl font-semibold mb-4">Characters</h2></div>;
const Quests = () => <div className="p-10"><h2 className="text-2xl font-semibold mb-4">Quests</h2><QuestEditor /></div>;
const RiftPressure = () => <div className="p-10"><h2 className="text-2xl font-semibold mb-4">Rift Pressure</h2></div>;
const Merchants = () => <div className="p-10"><h2 className="text-2xl font-semibold mb-4">Merchants</h2></div>;
const Journal = () => <div className="p-10"><h2 className="text-2xl font-semibold mb-4">Journal</h2></div>;
const NPCs = () => <div className="p-10"><h2 className="text-2xl font-semibold mb-4">NPCs</h2><NPCEditor /></div>;

const Nav = () => (
  <nav className="flex justify-between items-center p-5 bg-gray-900 text-white shadow-md">
    <h1 className="text-xl font-bold">The Shattered Veil</h1>
    <div className="space-x-4">
      <Link to="/" className="hover:text-teal-400">Home</Link>
      <Link to="/map" className="hover:text-teal-400">Map</Link>
      <Link to="/characters" className="hover:text-teal-400">Characters</Link>
      <Link to="/quests" className="hover:text-teal-400">Quests</Link>
      <Link to="/rift" className="hover:text-teal-400">Rift Pressure</Link>
      <Link to="/merchants" className="hover:text-teal-400">Merchants</Link>
      <Link to="/journal" className="hover:text-teal-400">Journal</Link>
      <Link to="/npcs" className="hover:text-teal-400">NPCs</Link>
    </div>
  </nav>
);

export default function App() {
  return (
    <Router>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-100">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/quests" element={<Quests />} />
          <Route path="/rift" element={<RiftPressure />} />
          <Route path="/merchants" element={<Merchants />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/npcs" element={<NPCs />} />
        </Routes>
      </motion.div>
    </Router>
  );
}



