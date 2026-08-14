import { createContext, useContext, useState } from "react";

const ProfileContext = createContext(null);

function getInitials(fullName) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    fullName: "Jamie Doe",
    email: "jamie.doe@example.com",
    phone: "(555) 123-4567",
    address: "482 Maple Street, Austin, TX 78701",
  });

  const initials = getInitials(profile.fullName);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, initials }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}
