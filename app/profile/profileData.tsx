"use client";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useProfile, updateProfile } from "./profileHelperFunctions";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { email, storeName, error, setError, supabase, loading } = useProfile();
  const [success, setSuccess] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  const [updating, setUpdating] = useState(false);
  const [changedStoreName, setChangedStoreName] = useState("");
  const handleUpdate = async () => {
    setUpdating(true);
    const errorData = await updateProfile(
      supabase,
      setError,
      setSuccess,
      changedStoreName
    );
    if (errorData == null) {
      setSuccess("Successfully updated");
    } else {
      setFailed(error);
    }
    setUpdating(false);
  };
  useEffect(() => {
    setChangedStoreName(storeName);
  }, [storeName]);
  const router = useRouter()

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-sm text-muted-foreground">
        Loading profile...
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <Input id="email" value={email} disabled className="w-full" />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="storeName"
            className="text-sm font-medium text-gray-700"
          >
            Store Name
          </label>
          <Input
            id="storeName"
            placeholder="Enter store name"
            value={changedStoreName}
            onChange={(e) => setChangedStoreName(e.target.value)}
            className="w-full"
          />
        </div>

        {failed ? (
          <Alert variant="destructive" className="w-full">
            <span className="font-semibold">Error:</span>
            <span className="ml-12">{failed}</span>
          </Alert>
        ) : (
          <></>
        )}

        {success && (
          <Alert variant="default" className="w-full flex-row">
            <h1 className="flex-row w-[55vw]">{success}</h1>
          </Alert>
        )}
        <Button onClick={() => router.push(`../login/reset/new-pass`)}>Change password</Button>

        <Button onClick={handleUpdate} disabled={updating} className="w-full">
          {updating ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </div>
  );
}
