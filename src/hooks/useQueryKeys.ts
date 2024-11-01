export const queryKeys = {
  user: {
    profile: ["user", "profile"] as const,
    settings: ["user", "settings"] as const,
    notifications: (userId: string) =>
      ["user", "notifications", userId] as const,
  },
  posts: {
    all: ["posts"] as const,
    detail: (id: string) => ["posts", id] as const,
    byUser: (userId: string) => ["posts", "user", userId] as const,
  },
  // Add other query keys as needed
} as const;
