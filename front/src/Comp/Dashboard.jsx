import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { BsSun, BsMoon } from "react-icons/bs";
import { MdDeleteSweep } from "react-icons/md";
import Nav from "./Nav";
import axios from "axios";

// ⭐ AXIOS INSTANCE (INSIDE SAME FILE)
const notesApi = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export default function Dashboard() {
  const containerRef = useRef(null);

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Z INDEX STACK STATE
  const [zIndexes, setZIndexes] = useState({});
  const [highestZ, setHighestZ] = useState(1);

  // Modal state
  const [selectedNote, setSelectedNote] = useState(null);

  const username = "User";

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    fetchNotes();
  }, []);

  // Normalize API
  const normalizeNotes = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.notes)) return data.notes;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  // ⭐ AXIOS FETCH NOTES
  const fetchNotes = async () => {
    try {
      const res = await notesApi.get("/notes");

      const normalized = normalizeNotes(res.data);
      setNotes(normalized);

      const initialZ = {};
      normalized.forEach((n, i) => {
        initialZ[n._id] = i + 1;
      });

      setZIndexes(initialZ);
      setHighestZ(normalized.length + 1);

    } catch (err) {
      console.error("Axios Fetch Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Bring note to top on drag
  const bringToFront = (id) => {
    setZIndexes((prev) => ({
      ...prev,
      [id]: highestZ,
    }));
    setHighestZ((prev) => prev + 1);
  };

  // ⭐ AXIOS DELETE NOTE
  const deleteNote = async (id) => {
    try {
      await notesApi.delete(`/notes/${id}`);

      setNotes((prev) => prev.filter((n) => n._id !== id));

      setZIndexes((prev) => {
        const newZ = { ...prev };
        delete newZ[id];
        return newZ;
      });

    } catch (err) {
      console.error("Axios Delete Error:", err.response?.data || err.message);
    }
  };

  // Truncate text helper
  const truncateText = (text = "", limit = 100) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  return (
    <div
      className={`${
        darkMode
          ? "bg-gradient-to-b from-[#0d0d0d] to-[#1e1f43] text-gray-300"
          : "bg-gradient-to-b from-[#f5f7fa] to-[#cbcef4] text-gray-800"
      } relative px-6 py-4 min-h-screen flex flex-col`}
    >
      <Nav />

      {/* DARK MODE BUTTON */}
      <button
        onClick={() => setDarkMode((p) => !p)}
        className="absolute top-11 right-8 p-2 bg-gray-800 text-white rounded-full"
      >
        {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
      </button>

      {/* BACKGROUND TITLE */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0.1 }}
        animate={{ scale: 2, opacity: 0.15 }}
        transition={{ duration: 1.5 }}
        className="pointer-events-none fixed top-1/2 left-1/2
        -translate-x-1/2 -translate-y-1/2
        text-[12vw] font-extrabold
        bg-gradient-to-r from-[#7b2ff7] to-[#4c51bf]
        text-transparent bg-clip-text"
      >
        TRASH.
      </motion.div>

      {/* NOTES GRID */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto
        columns-1 sm:columns-2 md:columns-3 lg:columns-4
        gap-6 px-14 py-10"
      >
        {loading ? (
          <p className="text-center mt-10">Loading...</p>
        ) : notes.length === 0 ? (
          <p className="text-center mt-10">No notes found</p>
        ) : (
          notes.map((note) => (
            <motion.div
              key={note._id}
              drag
              dragConstraints={containerRef}
              dragElastic={0.2}
              onDragStart={() => bringToFront(note._id)}
              whileDrag={{ scale: 1.05 }}
              style={{
                zIndex: zIndexes[note._id] || 1,
                position: "relative",
                willChange: "transform",
              }}
              className={`${
                darkMode ? "bg-[#1b1b1b]" : "bg-white shadow-xl"
              } break-inside-avoid w-full mb-6 p-5 rounded-2xl`}
            >
              {/* HEADER */}
              <div className="flex justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-sm text-white">
                    {username[0]}
                  </div>
                  <p className="text-sm opacity-70">~ {username}</p>
                </div>

                <button
                  onClick={() => deleteNote(note._id)}
                  className="hover:text-red-500 transition"
                >
                  <MdDeleteSweep size={20} />
                </button>
              </div>

              {/* CONTENT */}
              {(() => {
                const fullText =
                  note.description || note.discription || "";
                const isLong = fullText.length > 100;

                return (
                  <>
                    <p className="text-sm mt-2 whitespace-pre-wrap">
                      {truncateText(fullText, 100)}
                    </p>

                    {isLong && (
                      <button
                        onClick={() => setSelectedNote(note)}
                        className="mt-2 text-xs text-blue-500 hover:underline"
                      >
                        Read More
                      </button>
                    )}
                  </>
                );
              })()}

              {/* DATE */}
              <p className="text-xs mt-3 opacity-60">
                {note.createdAt
                  ? new Date(note.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </motion.div>
          ))
        )}
      </div>

      {/* MODAL */}
      {selectedNote && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedNote(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`${
              darkMode
                ? "bg-[#1b1b1b] text-white"
                : "bg-white text-black"
            } w-[90%] max-w-4xl max-h-[80vh] p-6 rounded-2xl shadow-2xl overflow-scroll relative`}
          >
            <div className="flex justify-start items-center mb-4">
              <h3 className="font-bold text-lg">
                {selectedNote.title ||
                  selectedNote.tittle ||
                  "Untitled"}
              </h3>
            </div>

            <button
              onClick={() => setSelectedNote(null)}
              className="absolute top-4 right-4 text-sm opacity-70 hover:opacity-100"
            >
              ✕
            </button>

            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {selectedNote.description ||
                selectedNote.discription ||
                ""}
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
