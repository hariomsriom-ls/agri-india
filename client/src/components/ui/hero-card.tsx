import React from "react";
import { motion } from "framer-motion";

interface HeroCardProps {
    title: string;
    description: string;
    slogan: string,
}

export function HeroCard({
    title,
    description,
    slogan,
}: HeroCardProps) {
    return (
        <div className="absolute px-5 inset-y-0 right-0 flex items-center w-4/10 justify-end ">

        <div className=" h-9/10 rounded-3xl p-5 bg-linear-to-r from-cyan-200/30 to-lime-200/30 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl">
            <h1 className="text-5xl font-bold text-black">
                {title}
            </h1>
            <h1 className="text-4xl font-bold text-black">
                {slogan}
            </h1>

           <p className="mt-6 text-xl text-black">
                {description}
            </p>
        </div>
    </div>
    );
}