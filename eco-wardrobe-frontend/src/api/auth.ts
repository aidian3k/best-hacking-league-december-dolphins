import { useMutation } from '@tanstack/react-query';
import { User, LoginCredentials, RegisterData } from '@/types/user';
import { BackendUserDTO } from './backendTypes';

const API_BASE_URL = 'http://localhost:8080/api';

function convertBackendUserToUser(backendUser: BackendUserDTO): User {
  let profilePictureBase64: string | null = null;
  if (backendUser.profilePicture && Array.isArray(backendUser.profilePicture) && backendUser.profilePicture.length > 0) {
    try {
      const bytes = new Uint8Array(backendUser.profilePicture);
      const binary = String.fromCharCode(...bytes);
      profilePictureBase64 = `data:image/jpeg;base64,${btoa(binary)}`;
    } catch (error) {
      console.warn('Błąd konwersji zdjęcia profilowego:', error);
    }
  }

  const preferences = backendUser.preference ? {
    allergies: backendUser.preference.allergies?.map(a => a.name) || [],
    preferredMaterials: backendUser.preference.preferredMaterials?.map(pm => pm.material) || [],
  } : undefined;

  return {
    id: backendUser.id,
    email: backendUser.email,
    name: backendUser.name,
    profilePicture: profilePictureBase64,
    isInfluencer: backendUser.isInfluencer || false,
    preferences,
  };
}

async function loginUser(credentials: LoginCredentials): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Nieprawidłowy email lub hasło');
    }
    throw new Error('Błąd logowania');
  }

  const data: BackendUserDTO = await response.json();
  return convertBackendUserToUser(data);
}

async function registerUser(data: RegisterData): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      name: data.name,
      password: data.password,
    }),
  });

  if (!response.ok) {
    throw new Error('Błąd rejestracji');
  }

  const userData: BackendUserDTO = await response.json();
  return convertBackendUserToUser(userData);
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: loginUser,
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerUser,
  });
}

