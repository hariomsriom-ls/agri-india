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
        <div className="glass-card">
                <div className="absolute inset-y-0 right-0 flex items-center justify-end ">

        <div className="w-85/100 h-9/10 rounded-3xl p-10 bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl">
            <h1 className="text-5xl font-bold text-white">
                {title}
            </h1>
            <h1 className="text-4xl font-bold text-white">
                {slogan}
            </h1>

           <p className="mt-6 text-xl text-white/80">
                {description}
            </p>
        </div>
    </div>

        </div>
    );
}