export class LoginResponseDto {
  token: string;
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    selectedTier?: string;
    gender?: string;
    [key: string]: any;
  };
}



