"use client";

import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((store) => store.isLoggedIn);

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <h1 className="p-4 text-white text-center">
        Welcome to the authentication section for Next.js
      </h1>
      {isLoggedIn ? (
        <Link href="/profile">Go to Profile</Link>
      ) : (
        <div
          id="auth-buttons"
          className="flex items-center justify-center p-6 gap-6"
        >
          <button
            className="px-6 py-2 border-2 border-white rounded cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
          <button
            className="px-6 py-2 border-2 border-white rounded cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Signup
          </button>
        </div>
      )}
    </div>
  );
}
