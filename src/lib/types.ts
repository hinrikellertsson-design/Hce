export type Role = "TEACHER" | "STUDENT";
export type SubmissionStatus = "SUBMITTED" | "GRADED";

export const roleLabels: Record<Role, string> = {
  TEACHER: "Kennari",
  STUDENT: "Nemandi",
};

export const statusLabels: Record<SubmissionStatus, string> = {
  SUBMITTED: "Skilað",
  GRADED: "Metið",
};
