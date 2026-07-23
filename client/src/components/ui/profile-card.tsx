"use client";

import React from "react";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface ProfileCardProps {
  name: string;
  image: string;
  id: string;
  online?: boolean;
}

export default function ProfileCard({id, name, image}: ProfileCardProps){
  return (
    <div className="flex w-48 h-24">
        <div className=" flex w-2/3 h-full px-1 justify-end items-center">{name}</div>
        <Link href={`/profile/${id}`}
        className="flex items-center">
        <img 
        src={image}
        alt="name"
        className=" w-14 h-14 rounded-full bg-green-600 border-indigo-500 object-cover cursor-pointer"/>
        </Link>

    </div>
  );
}