"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const NavbarStory = () => {
  const router = useRouter();

  return (
    <div className="px-8 py-2 border-b-[1px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Image
              src="/medium-icon.svg"
              width={40}
              height={40}
              alt="Medium Logo"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-7">
          <button className="flex items-center opacity-90 hover:opacity-100 duration-100 ease-in cursor-pointer bg-green-600 hover:bg-green-700 text-[13px] text-white px-3 py-1 rounded-full">
            Publish
          </button>
          <UserButton signInUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default NavbarStory;
