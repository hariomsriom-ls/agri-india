"use client";
import React from "react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card = ({children,className}:CardProps) => {
    return (
        <div
            className={`
                rounded-xl
                p-5
                ${className}   
            `}
        >
            {children}
        </div>
    )
}

export default Card