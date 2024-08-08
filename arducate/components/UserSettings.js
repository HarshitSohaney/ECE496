"use client";

import { useAtom } from "jotai";
import { userAtom } from "../atoms/globalAtoms";

export default function UserSettings() {
  const [user, setUser] = useAtom(userAtom);

  const updateName = (event) => {
    setUser({ ...user, name: event.target.value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-2xl font-semibold mb-4">User Settings</h2>
      <input
        type="text"
        value={user.name}
        onChange={updateName}
        placeholder="Enter your name"
        className="w-full p-2 border rounded mb-2"
      />
      <p>
        Current user:{" "}
        <span className="font-semibold">{user.name || "Anonymous"}</span>
      </p>
    </div>
  );
}
