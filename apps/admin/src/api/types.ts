export interface ChangePasswordDto {
  newPassword: string;
}

export interface GetTeamInfoDto {
  ids: Array<number> | null;
}

export interface GetUserByAddressDto {
  address: string;
}

export interface Tree {
  id: number;
  address: string;
  sharerIds: Array<number>;
}
