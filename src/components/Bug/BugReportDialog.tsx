import { useState } from "react";
import { Bug } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";

import { toast } from "sonner";

const modules = [
  "Home Feed",
  "Search",
  "Profile",
  "Messages",
  "Notifications",
  "Bookmarks",
  "Post Tweet",
  "Authentication",
  "Settings",
  "Other",
];

export function BugReportDialog() {
  const [open, setOpen] = useState(false);
  const [module, setModule] = useState("");
  const [bug, setBug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  if (!module || !bug.trim()) {
    toast.error("Please fill all fields");
    return;
  }
  setIsSubmitting(true);
  try {
    await fetch(import.meta.env.VITE_GOOGLE_SHEET_URL, {
      method: "POST",
      body: JSON.stringify({ module, bug }),
    });
    toast.success("Bug reported successfully!");
    setModule("");
    setBug("");
    setOpen(false);
  } catch {
    toast.error("Failed to submit. Try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="
            flex items-center gap-4 px-3 py-3
            rounded-full transition-colors
            w-fit xl:w-full
            hover:bg-gray-100
          "
        >
          <Bug className="w-6 h-6 shrink-0 text-gray-700" />

          <span className="hidden xl:block text-gray-900 text-xl">
            Report Bug
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Report a Bug
          </DialogTitle>

          <DialogDescription>
            Help us improve by reporting issues you found.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Module */}
          <div className="space-y-2">
            <Label>Module</Label>

            <Select value={module} onValueChange={setModule}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select module" />
              </SelectTrigger>

              <SelectContent>
                {modules.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bug Description */}
          <div className="space-y-2">
            <Label>Bug Description</Label>

            <Textarea
              value={bug}
              onChange={(e) => setBug(e.target.value)}
              placeholder="Describe the issue..."
              className="min-h-[120px] resize-none"
              maxLength={500}
            />

            <p className="text-xs text-gray-400 text-right">
              {bug.length}/500
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}