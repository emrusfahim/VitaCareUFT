export interface LoginData {
  phone: string;
  otp: string;
  expectedResult?: string;
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  companyName: string;
}