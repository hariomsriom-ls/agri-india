"use client";
import React from "react";
import { createPortal } from "react-dom";
import Card from "../../ui/customizable-cards";
import { useRouter } from "next/navigation";
import{FaCheckCircle, MdCancel} from "@/components/ui/icons"

interface ResponseProps {
   loading?: boolean;
   processSuccess: boolean;
   message: string;
   onClose?: () => void;
   callMethod: string;
}

const ResponseCard = ({ loading = false, processSuccess, message, onClose, callMethod }: ResponseProps) => {
    const router = useRouter();
    console.log(callMethod);

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <Card className="flex flex-col w-[90%] max-w-md bg-white p-6 rounded-2xl shadow-2xl relative text-center">
                {onClose && (
                    <div className="absolute top-4 right-4">
                        <button 
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    </div>
                )}
                <div className="flex flex-col items-center justify-center py-6 gap-4">
                    {loading ? (
                        <>
                            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            <h2 className="text-2xl font-bold text-gray-800">Processing Registration...</h2>
                            <p className="text-sm text-gray-500">Please wait while we submit your details.</p>
                        </>
                    ) : processSuccess ? (
                        <>
                            <div className="flex justify-center text-green-500 text-6xl">
                                <FaCheckCircle />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Registered Successfully!</h2>
                            <p className="text-sm text-gray-600 px-4">{message || "Your registration request has been submitted."}</p>
                            <button
                                onClick={() => router.push("/login")}
                                className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-all"
                            >
                                Go to Login
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-center text-red-500 text-6xl">
                                <MdCancel />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">{callMethod} Failed</h2>
                            <p className="text-sm text-red-600 px-4">{message || "Unable to complete registration. Please try again."}</p>
                            <div className="flex gap-4 mt-4">
                                {onClose && (
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2.5 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-xl transition-all"
                                    >
                                        Edit Details
                                    </button>
                                )}
                                <button
                                    onClick={() => router.replace("/")}
                                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-all"
                                >
                                    Home
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>,
        document.body
    );
};


export {ResponseCard}