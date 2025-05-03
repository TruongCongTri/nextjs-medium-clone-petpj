"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const getCurrentUserId = async () => {
  const { userId } = await auth();
  return userId;
};

export const getCurrentUser = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const user = await (await clerkClient()).users.getUser(userId);
  return JSON.parse(JSON.stringify(user))
};

export const getPublishedUser = async (userId: string) => {
  if (!userId) throw new Error("User not authenticated");
  const user = await (await clerkClient()).users.getUser(userId);
  return JSON.parse(JSON.stringify(user));
};
