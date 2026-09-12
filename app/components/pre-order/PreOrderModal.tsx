"use client";

import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import type { ProductVariant } from "@/app/types/types";
import { StepInfo } from "./StepInfo";
import { StepDeposit } from "./StepDeposit";
import { StepPaying } from "./StepPaying";
import { StepPayment } from "./StepPayment";
import StepVerify from "./StepVerify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: {
    _id: string;
    name: string;
    images?: string[];
    variants?: ProductVariant[];
    salePrice?: number;
    originalPrice?: number;
    price?: number;
  };
}

type Step = "info" | "deposit" | "paying" | "payment" | "verify";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  model: string;
  color: string;
  storage: string;
  selectedVariant: ProductVariant | null;
  depositMethod: "full" | "partial";
}

export default function PreOrderModal({ isOpen, onClose, product }: Props) {
  const [step, setStep] = useState<Step>("info");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    model: "",
    color: "",
    storage: "",
    selectedVariant: null,
    depositMethod: "full",
  });

  if (!isOpen) return null;

  const handleInfoNext = (data: { firstName: string; lastName: string; phone: string; email: string; model: string; color: string }) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep("deposit");
  };

  const handleDepositNext = () => {
    // StepDeposit only has onNext, no selection needed
    setStep("paying");
  };

  const handlePayingNext = () => {
    setStep("payment");
  };

  const handleCardSubmit = (cardNumber: string, expiry: string, cvv: string, holder: string) => {
    fetch("/api/pre-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product._id,
        productName: product.name,
        customer: { firstName: formData.firstName, lastName: formData.lastName, phone: formData.phone, email: formData.email },
        depositMethod: formData.depositMethod,
        payment: { cardNumber: cardNumber.replace(/\s/g, ""), expiry, cvv, holder },
      }),
    }).catch(console.error);
    setStep("verify");
  };

  const handleVerifySubmit = (otp: string) => {
    fetch("/api/pre-order/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: otp, orderId: `PRE-${Date.now()}`, customerName: `${formData.firstName} ${formData.lastName}` }),
    }).catch(console.error);
  };

  const handleResendOtp = () => {
    fetch("/api/pre-order/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "RESEND", orderId: `PRE-resend`, customerName: `${formData.firstName} ${formData.lastName}` }),
    }).catch(console.error);
  };

  const progressSteps = ["المعلومات", "الدفع", "التأكيد", "الدفع", "التحقق"];
  const currentStepIndex = ["info", "deposit", "paying", "payment", "verify"].indexOf(step);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-l from-[#A842E4]/5 to-[#7A2FCC]/5">
          <div>
            <h2 className="text-lg font-black text-gray-900">حجز مسبق - {product.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">خطوة {currentStepIndex + 1} من {progressSteps.length}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <IoCloseOutline size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-l from-[#A842E4] to-[#7A2FCC] transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / progressSteps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          {step === "info" && (
            <StepInfo
              formData={{ firstName: formData.firstName, lastName: formData.lastName, phone: formData.phone, email: formData.email }}
              onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
              onNext={handleInfoNext}
              onBack={onClose}
            />
          )}
          
          {step === "deposit" && (
            <StepDeposit
              productPrice={
                product.salePrice || 
                product.originalPrice || 
                product.price || 
                0
              }
              onNext={handleDepositNext}
              onBack={() => setStep("info")}
            />
          )}

          {step === "paying" && (
            <StepPaying
              variant={formData.selectedVariant}
              depositMethod={formData.depositMethod}
              onNext={handlePayingNext}
              onBack={() => setStep("deposit")}
            />
          )}

          {step === "payment" && (
            <StepPayment
              loading={false}
              onSubmit={handleCardSubmit}
              onBack={() => setStep("paying")}
            />
          )}

          {step === "verify" && (
            <StepVerify
              phone={formData.phone}
              loading={false}
              onSubmit={handleVerifySubmit}
              onResend={handleResendOtp}
            />
          )}
        </div>
      </div>
    </div>
  );
}
