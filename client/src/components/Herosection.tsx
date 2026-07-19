"use client";
import { useState, useEffect } from "react";
import  { HeroCard }  from "./ui/hero-card";
import { heroData } from "@/data/HeroData";

export function Herosection() {
    const [active, setActive] = useState("");
    const [currentSlide, setcurrentSliide] = useState(0);
    return(
<div className="h-screen">
<div className="relative w-full h-9/10 overflow-hidden rounded-3xl">

    <img
        src="/images/hero.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
    />
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