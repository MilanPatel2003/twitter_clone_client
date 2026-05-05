import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // get email and otp passed from ForgotPasswordPage
  const email = location.state?.email;
  const generatedOtp = location.state?.otp;

  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // countdown timer — 2 minutes
  const [secondsLeft, setSecondsLeft] = useState(120);
  const isExpired = secondsLeft <= 0;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isExpired) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // format seconds as mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
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
          Reset password
        </h1>
        <p className="text-gray-500 text-sm mb-2">
          Enter the OTP sent to <span className="font-semibold text-gray-700">{email}</span>
        </p>

        {/* OTP display */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Your OTP</p>
            <p className="text-2xl font-extrabold text-[#1d9bf0] tracking-widest">
              {generatedOtp}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-0.5">Expires in</p>
            <p className={`text-lg font-bold ${isExpired ? "text-red-500" : secondsLeft <= 30 ? "text-orange-500" : "text-gray-700"}`}>
              {isExpired ? "Expired" : formatTime(secondsLeft)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-gray-700 font-medium">Enter OTP</Label>
            <Input
              name="otp"
              placeholder="6 digit OTP"
              value={form.otp}
              onChange={handleChange}
              maxLength={6}
              required
              className="h-11 rounded-lg border-gray-300 focus-visible:ring-[#1d9bf0] tracking-widest text-center text-lg font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-gray-700 font-medium">New Password</Label>
            <Input
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
              required
              className="h-11 rounded-lg border-gray-300 focus-visible:ring-[#1d9bf0]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-gray-700 font-medium">Confirm Password</Label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="h-11 rounded-lg border-gray-300 focus-visible:ring-[#1d9bf0]"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || isExpired}
            className="w-full h-11 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold rounded-full text-base disabled:opacity-50"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Didn't get OTP?{" "}
          <Link to="/forgot-password" className="text-[#1d9bf0] font-semibold hover:underline">
            Try again
          </Link>
        </p>
      </div>
    </div>
  );
}