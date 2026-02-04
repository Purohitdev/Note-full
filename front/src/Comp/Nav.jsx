import { useNavigate } from "react-router-dom";

function Nav({ showBackButton = false }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-16 py-6">
      <div className="flex gap-4 items-center">
        {/* Simple User Placeholder */}
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
         <img src="https://i.pinimg.com/736x/46/c9/40/46c94007c54ea2159dafc3eb72aa6259.jpg" alt="" />
        </div>

        <h1>Dump Trash</h1>
      </div>

      {showBackButton ? (
        <button
          className="rounded-3xl px-4 py-2 bg-gray-800 text-white"
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </button>
      ) : (
        <button
          className="rounded-3xl px-4 py-2 bg-gray-800 text-white"
          onClick={() => navigate("/add")}
        >
          Add Trash
        </button>
      )}
    </div>
  );
}

export default Nav;
