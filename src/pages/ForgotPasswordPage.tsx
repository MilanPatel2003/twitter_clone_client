import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      const otp = res.data.otp;
      toast.success("OTP generated!");
      // pass email and otp to next page via state
      navigate("/reset-password", { state: { email, otp } });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#1d9bf0]">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Forgot password?
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Enter your email and we'll send you an OTP.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-gray-700 font-medium">Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-lg border-gray-300 focus-visible:ring-[#1d9bf0]"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold rounded-full text-base"
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </Button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-[#1d9bf0] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}