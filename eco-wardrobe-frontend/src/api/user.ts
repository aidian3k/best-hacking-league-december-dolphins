import { useMutation } from '@tanstack/react-query';
import { User } from '@/types/user';
import { BackendUserDTO } from './backendTypes';
import { convertBackendUserToUser } from './userMapper';
import { base64ToByteArray } from '@/lib/utils';

const API_BASE_URL = 'http://localhost:8080/api';

async function uploadUserPhoto(userId: string, imageBase64: string): Promise<User> {
  let imageArray: number[] | null = null;
  if (imageBase64) {
    try {
      const base64WithoutPrefix = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      imageArray = base64ToByteArray(base64WithoutPrefix);
    } catch (error) {
      console.warn('Błąd konwersji obrazu do formatu backendu:', error);
      throw new Error('Błąd konwersji obrazu');
    }
  }

  const response = await fetch(`${API_BASE_URL}/users/add-photo/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      profilePicture: imageArray,
    }),
  });

  if (!response.ok) {
    throw new Error('Błąd wgrywania zdjęcia profilowego');
  }

  const data: BackendUserDTO = await response.json();
  return convertBackendUserToUser(data);
}

export function useUploadUserPhotoMutation() {
  return useMutation({
    mutationFn: ({ userId, imageBase64 }: { userId: string; imageBase64: string }) =>
      uploadUserPhoto(userId, imageBase64),
  });
}

