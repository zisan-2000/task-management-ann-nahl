"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  console.log(role, "Current user role");
  useEffect(() => {
    if (!role) return;

    const timeout = setTimeout(() => {
      if (role === "admin") router.replace("/admin");
      else if (role === "agent") router.replace("/agent");
      else if (role === "manager") router.replace("/manager");
      else router.push("/");
    }, 100); // slight delay to ensure cookie reads and router is ready

    return () => clearTimeout(timeout);
  }, [role, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Invalid credentials");
      } else {
        toast.success("Signed in successfully!");
        setRole(data.user.role); // wait for redirect based on role
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-transparent border-none">
      <CardHeader>
        <div className="flex items-center text-slate-500 justify-center mb-3">
          <img src="/aan-logo.png" alt="aan-logo" />
        </div>
        <CardTitle className="text-2xl text-white flex items-center justify-center">
          Task Management
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-transparent">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                className="placeholder:text-white/80 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Your password"
                required
                className="placeholder:text-white/80 text-white"
              />
            </div>
            <Button
              type="submit"
              className={cn(
                "relative w-full rounded-md px-4 py-2 font-semibold text-white",
                "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
                "transition-all duration-300 ease-in-out hover:from-pink-500 hover:to-indigo-500",
                "shadow-lg hover:shadow-pink-400/40 disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin w-5 h-5 mx-auto" />
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
