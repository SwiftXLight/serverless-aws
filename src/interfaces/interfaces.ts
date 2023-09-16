export interface User {
  email: string;
  password: string;
}

export interface IUserItem {
  primary_key: string;
  password: string;
}

export interface UserLink {
  id: string;
  ownerEmail: string;
  originalLink: string;
  expirationTime: string;
  visitCount: number;
}

export interface IDeleteExpiredShortLink {
  id: string;
  email: string;
}

export interface DecodedToken {
  email: string;
  iat: number;
  exp: number;
}

export interface INewSchedule {
  time: string;
  email: string;
  id: string;
}