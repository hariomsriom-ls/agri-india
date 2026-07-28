"use client";
import React from "react";
import Card from "../../ui/customizable-cards";
import{useState} from "react"
import { InputField } from "@/components/ui/Input";

//<div className="divide-y"></div>

export function AuthorityPersonalInformationcard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                label="Full Name"
                name="authorityName"
                placeholder="Enter Full Name"
                 required />
                
                <InputField
                label="Email"
                name="authorityEmail"
                placeholder="Enter Registered Email"
                 required />
                
                <InputField
                label="Contact Number"
                name="authorityNumber"
                placeholder="Enter Contact Number"
                 required />

                <InputField
                label="Username"
                name="authorityUsername"
                placeholder="Enter Username"
                 required />

                <InputField
                label="Password"
                name="authorityNumber"
                placeholder="Enter strong password"
                 required />

            </div>
        </Card>
    )}

export function AuthorityAddresscard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                label="House No/Flat no/ Road no"
                name="auHouseno"
                placeholder="Enter House no"
                 />

                <InputField
                label="Land Mark"
                name="aulandmark"
                placeholder="Enter nearby landmark"
                 required />

                 <InputField
                label="Country"
                name="auHouseno"
                placeholder="Enter House no"
                 required />
            </div>

        </Card>
    )}

export function AuthorityBankingcard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                label="Bank"
                name="auBankName"
                placeholder="Enter Full Name"
                 required />
                
                <InputField
                label="Account Number"
                name="auAccountnumber"
                placeholder="Enter A/c number"
                 required />
                
                <InputField
                label="Ifsc Code"
                name="auIfscCode"
                placeholder="Enter Ifsc Code"
                 required />

                <InputField
                label="Banking Name"
                name="auBankingname"
                placeholder="Enter Username"
                 required />
            </div>
        </Card>
    )}

export function AuthorityDocumentscard() {
    const [active, setActive] = useState("");
    return(
        <Card className=" flex-1 aspect-2 ">
            <div className="flex w-2/3 flex-col">
                <InputField
                label="Account Number"
                name="auAccountnumber"
                placeholder="Enter A/c number"
                 required />
                
                <InputField
                label="Ifsc Code"
                name="auIfscCode"
                placeholder="Enter Ifsc Code"
                 required />

                <InputField
                label="Banking Name"
                name="auBankingname"
                placeholder="Enter Username"
                 required />
            </div>
        </Card>
    )}

