import { User } from '@/types/user';
import { BackendUserDTO } from './backendTypes';
import { convertBackendImageToBase64 } from '@/lib/utils';

export function convertBackendUserToUser(backendUser: BackendUserDTO): User {
  const profilePictureBase64 = convertBackendImageToBase64(backendUser.profilePicture);

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

