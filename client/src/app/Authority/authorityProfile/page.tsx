"use client";
import { AuthorityPersonalInformationcard, AuthorityAddresscard, AuthorityBankingcard, AuthorityDocumentscard
 } from "@/components/cards/authority/Aythority-profile";
export default function AuthorityProfile() {
  return (
    <>
   <div className="h-full">
     <div className="flex flex-col gap-4 pt-4 pl-3">
              <AuthorityPersonalInformationcard />
              <AuthorityAddresscard />
              <AuthorityBankingcard />
              <AuthorityDocumentscard />
           </div>
        </div>
    </>
  );
}