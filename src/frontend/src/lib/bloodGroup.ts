import { BloodGroup, UrgencyLevel } from "../backend";

export const BLOOD_GROUP_DISPLAY: Record<BloodGroup, string> = {
  [BloodGroup.A_pos]: "A+",
  [BloodGroup.A_neg]: "A-",
  [BloodGroup.B_pos]: "B+",
  [BloodGroup.B_neg]: "B-",
  [BloodGroup.AB_pos]: "AB+",
  [BloodGroup.AB_neg]: "AB-",
  [BloodGroup.O_pos]: "O+",
  [BloodGroup.O_neg]: "O-",
};

export const BLOOD_GROUP_OPTIONS = Object.entries(BLOOD_GROUP_DISPLAY).map(
  ([value, label]) => ({
    value: value as BloodGroup,
    label,
  }),
);

export const URGENCY_DISPLAY: Record<UrgencyLevel, string> = {
  [UrgencyLevel.Low]: "Low",
  [UrgencyLevel.Medium]: "Medium",
  [UrgencyLevel.High]: "High",
  [UrgencyLevel.Critical]: "Critical",
};

export const URGENCY_COLOR: Record<UrgencyLevel, string> = {
  [UrgencyLevel.Low]: "bg-green-100 text-green-800",
  [UrgencyLevel.Medium]: "bg-yellow-100 text-yellow-800",
  [UrgencyLevel.High]: "bg-orange-100 text-orange-800",
  [UrgencyLevel.Critical]: "bg-red-100 text-red-800",
};
