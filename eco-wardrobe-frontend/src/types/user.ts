export interface UserPreferences {
  allergies?: string[]; // np. ["Wool", "Latex", "Nickel"]
  preferredMaterials?: string[]; // np. ["Cotton", "Linen", "Hemp"]
}

export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string | null; // base64 data URL
  isInfluencer?: boolean;
  preferences?: UserPreferences;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

