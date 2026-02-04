import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BsSun, BsMoon } from "react-icons/bs";
import Nav from "./Nav";

const API_URL = "https://trash-9ud4.onrender.com/api/notes";

export default function Add() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        darkMode
          ? "bg-gradient-to-b from-[#0d0d0d] to-[#1e1f43] text-gray-300"
          : "bg-gradient-to-b from-[#f5f7fa] to-[#cbcef4] text-gray-800"
      } relative px-6 py-4 h-screen flex flex-col`}
    >
      <Nav showBackButton />

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-11 right-8 p-2 bg-gray-800 text-white rounded-full"
      >
        {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-2xl mx-auto p-6 rounded-lg shadow-lg ${
          darkMode ? "bg-[#1b1b1b]" : "bg-white"
        }`}
      >
        <h2 className="text-center text-2xl font-semibold">Add Note</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded h-32"
            required
          />

          <button
            disabled={loading}
            className="bg-gray-800 text-white p-2 rounded"
          >
            {loading ? "Saving..." : "Save Note"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
