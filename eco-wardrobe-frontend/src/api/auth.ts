import { useMutation } from '@tanstack/react-query';
import { User, LoginCredentials, RegisterData } from '@/types/user';

async function loginUser(credentials: LoginCredentials): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: credentials.email,
    name: 'Jan Kowalski',
  };
}

async function registerUser(data: RegisterData): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    id: '660e8400-e29b-41d4-a716-446655440001',
    email: data.email,
    name: data.name,
  };
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

