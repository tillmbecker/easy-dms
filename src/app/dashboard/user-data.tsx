"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreatePost, usePosts } from "@/hooks/usePosts";
import { useUser } from "@/hooks/useUser";

export default function UserData() {
  const { data: user, isLoading } = useUser();
  const createPost = useCreatePost();

  const handleCreate = async () => {
    try {
      await createPost.mutateAsync({
        title: "New Post",
        content: "Content",
      });
    } catch {
      // Error is handled by onError callback
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleCreate} disabled={createPost.isPending}>
        Create Post
      </Button>
    </div>
  );
}
