"use client";

type USER = {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
};

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<USER | null>(null);

  async function fetchUser() {
    try {
      const response = await axios.get("/api/users/me", {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error: ", error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data.message);
        console.error("Error Name: ", error.name);
        console.error("Error Message: ", error.message);
        console.error("Error cause: ", error.cause);
      }
    }
  }

  async function logout() {
    try {
      const response = await axios.get("/api/users/logout", {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        router.push("/profile", { scroll: true });
      }
    } catch (error) {
      console.error("Error: ", error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data.message);
        console.error("Error Name: ", error.name);
        console.error("Error Message: ", error.message);
        console.error("Error cause: ", error.cause);
      }
    }
  }

  return (
    <div>
      <h1 className="text-center p-2">Profile page</h1>
      <button
        className="px-4 py-2 cursor-pointer text-white border-2 border-white rounded"
        onClick={logout}
      >
        Logout
      </button>
      <button
        className="px-4 py-2 cursor-pointer text-white border-2 border-white rounded"
        onClick={fetchUser}
      >
        Fetch User
      </button>
      {user && (
        <div className="my-2 p-4">
          User Details are:
          <ul>
            <li>Username: {user?.username}</li>
            <li>Email: {user?.email}</li>
            <li>Admin: {user?.isAdmin ? "Yes" : "No"}</li>
            <li>Verified: {user?.isVerified ? "Verified" : "Not Verified"}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
