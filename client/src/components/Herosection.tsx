"use client";
import { useState, useEffect } from "react";
import  { HeroCard }  from "./ui/hero-card";
import { heroData } from "@/data/HeroData";
import {motion, AnimatePresence} from "framer-motion"
import { slideLeft, flipCard } from "@/utils/animaion";

export function Herosection() {
    const [active, setActive] = useState("");
    const [currentSlide, setcurrentSliide] = useState(0);
   useEffect(()=>{
    const interval = setInterval(()=> {
        setcurrentSliide((prev)=>(prev+1)%heroData.length)
    }, 4000)

    return() => clearInterval(interval);

   },[]);
    return(
<div className="h-screen">
<div className="relative w-full h-8/10 overflow-hidden rounded-3xl">
    <AnimatePresence>
    <motion.img
        key={currentSlide}
        src={heroData[currentSlide].image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover "
        {...slideLeft}
    />
    </AnimatePresence>

    <HeroCard  
    title = {heroData[currentSlide].title}
    slogan = {heroData[currentSlide].slogan}
    description = {heroData[currentSlide].description}
    />
</div>
</div>
    )
}

export default Herosection