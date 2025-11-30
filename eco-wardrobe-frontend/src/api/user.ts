import { useMutation } from '@tanstack/react-query';
import {BackendPreference} from "@/api/backendTypes.ts";

const API_BASE_URL = 'http://localhost:8080/api';

export interface ModifyPreferencesRequest {
  allergies: string[];
  preferredMaterials: string[];
}

export interface UserPreferencesResponse {
  id: string;
  email: string;
  name: string;
  preferences?: BackendPreference
}

async function modifyUserPreferences(
  userId: string,
  preferences: ModifyPreferencesRequest
): Promise<UserPreferencesResponse> {
  const response = await fetch(`${API_BASE_URL}/users/modify-preferences/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  });

  if (!response.ok) {
    throw new Error('Błąd aktualizacji preferencji');
  }

  return await response.json();
}

export function useModifyPreferencesMutation() {
  return useMutation({
    mutationFn: ({ userId, preferences }: { userId: string; preferences: ModifyPreferencesRequest }) =>
      modifyUserPreferences(userId, preferences),
  });
}

