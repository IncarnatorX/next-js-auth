"use client";

import { useAuthStore } from "@/store/auth";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();

  const user = useAuthStore((store) => store.user);
  const setUser = useAuthStore((store) => store.setUser);

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

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <header className="p-4 flex w-full items-center">
        <Link
          href="/"
          className="hover:underline hover:text-green-300"
          title="Go to Home page"
        >
          Home
        </Link>
        <p className="grow text-center">Profile Page</p>
        <button
          className="px-4 py-2 cursor-pointer text-white border-2 border-white rounded"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <button
        className="px-4 py-2 cursor-pointer text-white border-2 border-white rounded mx-4"
        onClick={fetchUser}
      >
        Fetch User
      </button>
      <button></button>
      {user && (
        <div className="my-2 p-4">
          <h1 className="font-bold text-2xl py-4">User Details are:</h1>
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
