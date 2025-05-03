"use client";
import { getPublishedUser } from "@/actions/user";
import { User } from "@clerk/nextjs/server";
import React, { useState, useEffect } from "react";
import Image from "next/image";

type Props = {
  userId: string;
  createdAt: Date;
};

const UserBadge = ({ userId, createdAt }: Props) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchUser = await getPublishedUser(userId);
        if (fetchUser) setUser(fetchUser);
      } catch (error) {
        console.log("Error fetching user", error);
      }
    };
    fetchUser();
  }, [user]);

  const calculateDaysAgo = (createdAt: Date) => {
    const currentDate = new Date();
    const createdDate = new Date(createdAt);
    const timeDiff: number = Math.abs(
      currentDate.getTime() - createdDate.getTime()
    );

    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (daysAgo > 365) return `${Math.floor(daysAgo / 365)} years ago`;
    if (daysAgo > 30) return `${Math.floor(daysAgo / 30)} months ago`;
    if (daysAgo > 0) return `${daysAgo} days ago`;
    
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    if (hoursAgo !== 0) return `${hoursAgo} hours ago`;
    const minutesAgo = Math.floor(timeDiff / (1000 * 60));
    if (minutesAgo !== 0) return `${minutesAgo} minutes ago`;
    const secondsAgo = Math.floor(timeDiff / 1000);
    return `${secondsAgo} seconds ago`;
  };
  return (
    <div className="px-4 text-sm">
      <div className="flex items-center space-x-3">
        <Image
          src={user?.imageUrl ? user.imageUrl : "/no-image.jpg"}
          width={32}
          height={32}
          alt="User"
          className="rounded-full object-cover"
          priority
        />
        <div>
          <p>
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs opacity-60">{calculateDaysAgo(createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default UserBadge;
