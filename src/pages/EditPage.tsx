// src/pages/EditProfilePage.tsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MainLayout } from "@/components/Layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import api from "@/lib/api";

export function EditProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<any>(user?.profile_image);
    const [cover, setCover] = useState<any>(user?.cover_image);

  const [coverUploading, setCoverUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const coverRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullname: user?.fullname ?? "",
    bio: user?.bio ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.put("/users/profile", form);
      toast.success("Profile updated!");
      navigate(-1);
    } catch (err: any) {
      console.log(err?.response?.data);
      toast.error(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("cover_image", file);

    try {
      setCoverUploading(true);
      const res = await api.put("/users/cover-image", formData);
      toast.success("Cover image updated!");
      setCover(res.data.url)
    } catch {
      toast.error("Failed to upload cover.");
    } finally {
      setCoverUploading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_pic", file);

    try {
      setAvatarUploading(true);
      const res = await api.put("/users/profile-image", formData);
      toast.success("Profile image updated!");
      setAvatar(res.data.url);
    } catch {
      toast.error("Failed to upload avatar.");
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <p className="font-bold text-lg">Edit profile</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="rounded-full bg-gray-900 hover:bg-gray-700 text-white font-bold h-9 px-4"
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Cover image */}
      <div className="relative h-48 bg-gradient-to-r from-[#1d9bf0]/30 to-[#1d9bf0]/10">
        {user?.cover_image && (
          <img src={cover} className="w-full h-full object-cover" />
        )}
        <input
          ref={coverRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverUpload}
        />
        <button
          onClick={() => coverRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
        >
          {coverUploading ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-[#1d9bf0] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}{" "}
        </button>
      </div>

      {/* Avatar */}
      <div className="px-4 -mt-12 mb-4">
        <div className="relative w-24 h-24">
          <Avatar className="w-24 h-24 border-4 border-white">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-[#1d9bf0] text-white text-3xl font-bold">
              {user?.fullname?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <input
            ref={avatarRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
          <button
            onClick={() => avatarRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 rounded-full transition-colors"
          >
            {avatarUploading ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-[#1d9bf0] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 space-y-5">
        {/* Full name */}
        <div className="space-y-1.5">
          <Label className="text-gray-500 text-sm">Name</Label>
          <Input
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            maxLength={50}
            className="border-gray-300 focus-visible:ring-[#1d9bf0] rounded-lg h-11"
          />
          <p className="text-gray-400 text-xs text-right">
            {form.fullname.length}/50
          </p>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <Label className="text-gray-500 text-sm">Bio</Label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            maxLength={160}
            rows={3}
            placeholder="Tell the world about yourself"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1d9bf0] resize-none"
          />
          <p className="text-gray-400 text-xs text-right">
            {form.bio.length}/160
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
