"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form));

    form.reset();

    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", formData);

      if (response.status === 200) {
        toast.success(response.data.message);
        router.push("/profile");
      }
    } catch (error) {
      console.error("ERROR: ", error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data.message);
        console.error("Error Name: ", error.name);
        console.error("Error Message: ", error.message);
        console.error("Error cause: ", error.cause);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="flex flex-col w-[60%] mx-auto items-center justify-center min-h-screen gap-5"
      onSubmit={handleLogin}
    >
      <h1 className="font-bold text-3xl">Login</h1>

      {/* EMAIL ADDRESS */}
      <div className="flex flex-col gap-2 w-[70%]">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address"
          className="p-3 border-2 border-white outline-none rounded-md w-full valid:border-green-500"
          required
        />
      </div>

      {/* PASSWORD */}
      <div className="flex flex-col gap-2 w-[70%]">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter password"
          className="p-3 border-2 border-white outline-none rounded-md w-full valid:border-green-500"
          minLength={8}
          maxLength={30}
          required
        />
      </div>

      {/* BUTTON */}
      <input
        type="submit"
        value={loading ? "Authenticating" : "Login"}
        disabled={loading}
        className={`px-4 py-2 rounded-md border-2 border-white transition-all ${
          loading ? "bg-gray-500 cursor-not-allowed" : "cursor-pointer"
        }`}
      />
      <Link href={"/signup"}>Not a Member! Signup here</Link>
    </form>
  );
}
