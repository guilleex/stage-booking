export class AuthModel {

    constructor(
        public id: number,
        public email: string,
        public username: string,
        public firstName: string,
        public lastName: string,
        public phone: string,
        public active: boolean,
        public roleId: number,
        public role: string,
        public token: string,
        public refreshToken: string,
        public tokenExpirationDate: Date
    ){}

    get accessToken() {

        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) return null;
   
        return this.token;
   
    }

    get tokenDuration() {

        if (!this.accessToken) return 0;

        return this.tokenExpirationDate.getTime() - new Date().getTime();

    }
    
}

export interface AuthApiData {
    id: number,
    email: string,
    userName: string,
    firstName: string,
    lastName: string,
    phone: string,
    active: boolean,
    roleId: number,
    roleName: string,
    token: string,
    refreshToken: string,
    expiresIn: number,
}

export interface RefreshTokenApiResponse {
    returnInt: number,
    returnText: string,
    newRefreshToken: string,
    newAccessTokne: string,
    expiresIn: number
}

export interface RegisterUserData {
    firstName: string,
    lastName: string,
    email: string | null,
    phone: string | null,
    userName: string,
    password: string
}
