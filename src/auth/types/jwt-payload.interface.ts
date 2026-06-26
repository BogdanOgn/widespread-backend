export enum TokenType {
  ACCESS = 'access_token',
  REFRESH = 'refresh_token',
}

export interface JwtPayload {
  sub: number;
  username: string;
  type: TokenType;
}
