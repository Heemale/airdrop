export interface ChangePasswordDto {
  newPassword: string;
}

export interface GetTeamInfoDto {
  ids: Array<number>;
}

export interface GetUserByAddressDto {
  address: string;
}
