import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account? This cannot be undone."
  );

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`https://elliott888-epl-model.hf.space/user/${user.id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to delete account");
    }

    // clear local storage
    localStorage.removeItem("token");

    alert("Account deleted successfully");

    // redirect to login
    navigate("/login");

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://elliott888-epl-model.hf.space/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error("Failed to fetch user");

        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div className="text-white p-6">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Account Details</h1>

      <div className="bg-slate-800 p-6 rounded-xl space-y-3">
        <p><strong>Name:</strong> {user.full_name || "N/A"}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>ID:</strong> {user.id || "N/A"}</p>
      </div>
      <button
  onClick={handleDeleteAccount}
  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
>
  Delete Account
</button>
    </div>
  );
}