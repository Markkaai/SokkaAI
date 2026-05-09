import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

const [fullName, setFullName] = useState(user?.full_name || "");
const [email, setEmail] = useState(user?.email || "");
const [profilePhoto, setProfilePhoto] = useState(null);
const [previewImage, setPreviewImage] = useState("");

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

const handleSaveProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      full_name: fullName,
      email: email,
      profile_photo_url: previewImage, // MUST be URL string
    };

    const res = await fetch(
      `https://elliott888-epl-model.hf.space/user/${user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Update failed");
    }

    setUser(data);
    setShowProfileModal(false);

    alert("Profile updated successfully");

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const handlePhotoChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setProfilePhoto(file);

  setPreviewImage(URL.createObjectURL(file));
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
  useEffect(() => {
  if (user) {
    setFullName(user.full_name || "");
    setEmail(user.email || "");
    setPreviewImage(user.profile_photo_url || "");
  }
}, [user]);

  if (!user) {
    return <div className="text-white p-6">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Account Details</h1>

      <div className="bg-slate-800 p-6 rounded-xl space-y-3">
        <img src={user.profile_photo_url || "https://via.placeholder.com/150"} alt="profile" className="w-16 h-16 rounded-full" />
        <p><strong>Name:</strong> {user.full_name || "N/A"}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p
      className={` font-black  px-1.5 py-0.5 rounded ${
        user?.is_admin
          ? "text-purple-300 "
          : "text-blue-300 "
      }`}
    >
      {user?.is_admin ? "Admin" : "Member"}
    </p>
      </div>
      <button onClick={() => setShowProfileModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-4">
        Edit Account
      </button>
      <button
  onClick={handleDeleteAccount}
  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
>
  Delete Account
</button>
{showProfileModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    
    <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          Edit Profile
        </h2>

        <button
          onClick={() => setShowProfileModal(false)}
          className="text-slate-400 hover:text-white text-xl"
        >
          ×
        </button>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <img
          src={previewImage}
          alt="profile"
          className="w-20 h-20 rounded-full border-4 border-blue-500/40"
        />
        <label className="mt-4 cursor-pointer bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm">

    Change Photo

    <input
      type="file"
      accept="image/*"
      onChange={handlePhotoChange}
      className="hidden"
    />

  </label>
      </div>

      {/* Form */}
      <div className="space-y-4">
        
        <div>
          <label className="text-sm text-slate-300 block mb-1">
            Full Name
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300 block mb-1">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </div>

      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        
        <button
          onClick={() => setShowProfileModal(false)}
          className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
        >
          Cancel
        </button>

        <button
        onClick={handleSaveProfile}
          className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
        >
          Save Changes
        </button>

      </div>

    </div>

  </div>
)}
    </div>
    
  );

  
}