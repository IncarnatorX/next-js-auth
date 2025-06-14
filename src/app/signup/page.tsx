"use client";

import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

export default function SignupPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const inputClassName = `p-3 border-2 border-white outline-none rounded-md w-full valid:border-green-500 ${
    loading ? "cursor-not-allowed" : ""
  }`;

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(form));

    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", formData);
      if (response.status === 201) {
        toast.success(response.data.message);
        router.push("/login", { scroll: true });
      }
    } catch (error) {
      console.error("ERROR: ", error);
      if (error instanceof AxiosError) {
        console.error(
          "Something wen't wrong while submitting a request to create a user."
        );
        toast.error(error?.response?.data.message);
        console.error("Error Name: ", error.name);
        console.error("Error Message: ", error.message);
        console.error("Error cause: ", error.cause);
      }
    } finally {
      setLoading(false);
      form.reset();
    }
  }

  return (
    <form
      className="flex flex-col w-[60%] mx-auto items-center justify-center min-h-screen gap-5"
      onSubmit={handleSignup}
    >
      <h1 className="font-bold text-3xl">Signup</h1>
      {/* USERNAME */}
      <div className="flex flex-col gap-2 w-[70%]">
        <label htmlFor="username">Name</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter username"
          className={inputClassName}
          disabled={loading}
          required
        />
      </div>

      {/* EMAIL ADDRESS */}
      <div className="flex flex-col gap-2 w-[70%]">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address"
          className={inputClassName}
          disabled={loading}
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
          className={inputClassName}
          minLength={8}
          maxLength={30}
          disabled={loading}
          required
        />
      </div>

      {/* BUTTON */}
      <input
        type="submit"
        value={loading ? "Processing...Please wait" : "Signup"}
        disabled={loading}
        className={`px-4 py-2 rounded-md border-2 border-white transition-all ${
          loading ? "bg-gray-500 cursor-not-allowed" : "cursor-pointer"
        }`}
      />
      <Link href="/login" className="hover:underline">
        Already a Member! Login here
      </Link>

      <Link href="/" className="hover:underline hover:text-green-300">
        Home
      </Link>
    </form>
  );
}
