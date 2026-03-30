import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Donor {
    contactInfo: string;
    donorId: Principal;
    area: string;
    name: string;
    bloodGroup: BloodGroup;
    lastDonation: Time;
}
export interface ContactSubmission {
    name: string;
    email: string;
    message: string;
    timestamp: Time;
}
export interface RecipientRequest {
    urgencyLevel: UrgencyLevel;
    requestId: Principal;
    area: string;
    requiredBloodGroup: BloodGroup;
    timestamp: Time;
    patientName: string;
    hospitalName: string;
}
export interface DonorInput {
    contactInfo: string;
    area: string;
    name: string;
    bloodGroup: BloodGroup;
}
export interface RecipientRequestInput {
    urgencyLevel: UrgencyLevel;
    area: string;
    requiredBloodGroup: BloodGroup;
    patientName: string;
    hospitalName: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum BloodGroup {
    AB_neg = "AB_neg",
    AB_pos = "AB_pos",
    B_neg = "B_neg",
    B_pos = "B_pos",
    A_neg = "A_neg",
    A_pos = "A_pos",
    O_neg = "O_neg",
    O_pos = "O_pos"
}
export enum UrgencyLevel {
    Low = "Low",
    High = "High",
    Medium = "Medium",
    Critical = "Critical"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllContactSubmissions(): Promise<Array<ContactSubmission>>;
    getAllDonors(): Promise<Array<Donor>>;
    getAllRecipientRequests(): Promise<Array<RecipientRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDonorById(donorId: Principal): Promise<Donor | null>;
    getRecipientRequestById(requestId: Principal): Promise<RecipientRequest | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerDonor(input: DonorInput): Promise<void>;
    registerRecipientRequest(input: RecipientRequestInput): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchDonorsByBloodGroupAndArea(bloodGroup: BloodGroup, area: string): Promise<Array<Donor>>;
    searchRecipientRequestsByBloodGroupAndArea(bloodGroup: BloodGroup, area: string): Promise<Array<RecipientRequest>>;
    submitContactForm(name: string, email: string, message: string): Promise<void>;
    getPendingDonors(): Promise<Array<Donor>>;
    getPendingRecipientRequests(): Promise<Array<RecipientRequest>>;
    approveDonor(donorId: Principal): Promise<boolean>;
    rejectDonor(donorId: Principal): Promise<boolean>;
    approveRecipientRequest(requestId: Principal): Promise<boolean>;
    rejectRecipientRequest(requestId: Principal): Promise<boolean>;
    deleteDonor(donorId: Principal): Promise<boolean>;
    deleteRecipientRequest(requestId: Principal): Promise<boolean>;
    updateDonor(donorId: Principal, input: DonorInput): Promise<boolean>;
    updateRecipientRequest(requestId: Principal, input: RecipientRequestInput): Promise<boolean>;
}
