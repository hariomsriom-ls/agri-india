"use client";
import React from "react";
import Card from "@/components/ui/customizable-cards";
import { Roleselectioncard } from "@/components/cards/registrationlogin/registration"

export default function Registration() {
    return(
        <>
        <main className="overscroll-none">
              <div className="h-screen flex items-center justify-center bg-[url('/images/registration.png')] bg-cover bg-center">
                <Roleselectioncard />
               </div>
              </main>
        </>
    )
}