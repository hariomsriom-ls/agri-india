"use client";
import React from "react";
import Card from "@/components/ui/customizable-cards";
import { useState, useRef } from "react";
import axios from "axios";
import api from "@/utils/services";
import {
  AuthorityPersonalInfoForm,
  AuthorityAddressForm,
  AuthorityBankForm,
  LandownerForm,
  WorkerPersonalInfoForm,
  WorkerAddressForm,
  WorkerBankForm,
  WorkerPersonalInfoFormRef,
  WorkerAddressFormRef,
  WorkerBankFormRef,
  AuthorityPersonalInfoFormRef,
  AuthorityAddressFormRef,
  AuthorityBankFormRef,
  LandownerFormRef,
} from "@/components/cards/registrationlogin/form";
import {
  ReviewCard,
  RoleselectionCard,
  ResponseCard,
} from "@/components/cards/registrationlogin/registration";
import { useworkerRegistration } from "@/contexts/registration/workerProvider";
import { useAuthorityRegistration } from "@/contexts/registration/authorityProvider";
import { useLandownerRegistration } from "@/contexts/registration/landownerProvider";

export default function Form() {
  const { WorkerformData, ResetWorkerformdata } = useworkerRegistration();
  const { AuthorityformData, ResetAuthorityformdata } = useAuthorityRegistration();
  const { LandownerformData, ResetLandownerformdata } = useLandownerRegistration();

  const [selectedRole, setSelectedRole] = useState("");
  const [step, setStep] = useState(1);
  const [showReview, setShowReview] = useState(false);
  const [showForm, setshowForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showResponse, setshowResponse] = useState(false);
  const [registrationSuccess, setregistrationSuccess] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");

  const WorkerpersonalInfoRef = useRef<WorkerPersonalInfoFormRef>(null);
  const WorkerAddressFormRef = useRef<WorkerAddressFormRef>(null);
  const WorkerBankFormRef = useRef<WorkerBankFormRef>(null);
  const AuthoritypersonalInfoRef = useRef<AuthorityPersonalInfoFormRef>(null);
  const AuthorityAddressFormRef = useRef<AuthorityAddressFormRef>(null);
  const AuthorityBankFormRef = useRef<AuthorityBankFormRef>(null);
  const LandownerPersonalInfoRef = useRef<LandownerFormRef>(null);

  const totalSteps = selectedRole === "landowner" ? 2 : 4;

  const next = () => {
    if (step === 2) {
      switch (selectedRole) {
        case "landowner":
          LandownerPersonalInfoRef.current?.saveData();
          setshowForm(false);
          setShowReview(true);
          break;
        case "worker":
          WorkerpersonalInfoRef.current?.saveData();
          break;
        case "authority":
          AuthoritypersonalInfoRef.current?.saveData();
          break;
      }
    } else if (step === 3) {
      switch (selectedRole) {
        case "worker":
          WorkerAddressFormRef.current?.saveData();
          break;
        case "authority":
          AuthorityAddressFormRef.current?.saveData();
          break;
      }
    } else if (step === 4) {
      switch (selectedRole) {
        case "worker":
          WorkerBankFormRef.current?.saveData();
          setshowForm(false);
          setShowReview(true);
          break;
        case "authority":
          AuthorityBankFormRef.current?.saveData();
          setshowForm(false);
          setShowReview(true);
          break;
      }
    }

    if (step < totalSteps || (selectedRole === "landowner" && step === 1)) {
      setStep((prev) => prev + 1);
    }
  };

  const previous = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
    if (step === 2) {
      switch (selectedRole) {
        case "landowner":
          ResetLandownerformdata();
          break;
        case "worker":
          ResetWorkerformdata();
          break;
        case "authority":
          ResetAuthorityformdata();
          break;
      }
    }
  };

  const renderForm = () => {
    if (step === 1) {
      return (
        <RoleselectionCard
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />
      );
    }

    if (selectedRole === "authority") {
      switch (step) {
        case 2:
          return <AuthorityPersonalInfoForm ref={AuthoritypersonalInfoRef} />;
        case 3:
          return <AuthorityAddressForm ref={AuthorityAddressFormRef} />;
        case 4:
          return <AuthorityBankForm ref={AuthorityBankFormRef} />;
      }
    } else if (selectedRole === "landowner") {
      switch (step) {
        case 2:
          return <LandownerForm ref={LandownerPersonalInfoRef} />;
      }
    } else if (selectedRole === "worker") {
      switch (step) {
        case 2:
          return <WorkerPersonalInfoForm ref={WorkerpersonalInfoRef} />;
        case 3:
          return <WorkerAddressForm ref={WorkerAddressFormRef} />;
        case 4:
          return <WorkerBankForm ref={WorkerBankFormRef} />;
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setshowResponse(true);
    try {
      let response;
      if (selectedRole === "worker") {
        response = await api.post("/pending-registration/pending-worker-request", WorkerformData);
      } else if (selectedRole === "authority") {
        response = await api.post("/authority/register-authority", AuthorityformData);
      } else if (selectedRole === "landowner") {
        response = await api.post("/landowner/registerlandowner", LandownerformData);
      }

      setregistrationSuccess(true);
      setRegistrationMessage(response?.data?.message || "User registered successfully");
    } catch (error) {
      setregistrationSuccess(false);
      if (axios.isAxiosError(error)) {
        setRegistrationMessage(error.response?.data?.message || "Registration failed");
      } else {
        setRegistrationMessage("An unexpected error occurred during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showForm && (
        <div className="flex h-28/30 w-25/30 bg-linear-to-b from-black/30 to-black/50 justify-center items-center rounded-lg">
          <Card className="h-83/100 w-8/10 rounded-3xl shadow-2xl bg-linear-to-b from-black/50 to-black/80 relative">
            <div className="pb-2">
              <div className="flex gap-3">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full border ${
                      index < step
                        ? "bg-green-500 border-green-500"
                        : "border-white/20"
                    }`}
                  />
                ))}
              </div>
              <p className="text-green-400 text-sm">
                {" "}
                Step {step} of {totalSteps}{" "}
              </p>
            </div>

            {renderForm()}

            {step > 1 && (
              <div className="absolute bottom-5 left-5">
                <button
                  onClick={previous}
                  disabled={step === 1}
                  className="px-8 py-3 rounded-xl bg-gray-700 text-white hover:bg-gray-500"
                >
                  <span className="text-sm">←</span>
                  <span className="pl-4">Previous</span>
                </button>
              </div>
            )}
            <div className="absolute bottom-5 right-5">
              <button
                onClick={next}
                disabled={step === 1 && !selectedRole}
                className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white"
              >
                <span className="pr-4">{step === totalSteps ? "Review" : "Next"}</span>
                <span className="text-sm">→</span>
              </button>
            </div>
          </Card>
        </div>
      )}
      {showReview && (
        <ReviewCard
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          onClose={() => {
            setShowReview(false);
            setshowForm(true);
          }}
          reduceStep={() => setStep((prev) => prev - 1)}
          onSubmit={() => {
            setShowReview(false);
            handleSubmit();
          }}
        />
      )}
      {showResponse && (
        <ResponseCard
          loading={loading}
          registrationSuccess={registrationSuccess}
          message={registrationMessage}
          onClose={() => {
            setshowResponse(false);
            setshowForm(true);
          }}
        />
      )}
    </>
  );
}