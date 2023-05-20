export class user {
  constructor(
    public email: string,
    public uid: string,
    private _token: string,
    private _refreshToken: string,
    private _expirationTime: Date
  ) {}

  get token() {
    if(!this._expirationTime || new Date() > this._expirationTime) {
      return "";
    }
    return this._token;
  }

  get refreshToken() {
    return this._refreshToken;
  }

  get expirationTime() {
    return this._expirationTime;
  }

  set refreshToken(refreshToken: string) {
    this._refreshToken = refreshToken;
  }

  set expirationTime(expirationTime: Date) {
    this._expirationTime = expirationTime;
  }

  set token(token: string) {
    this._token = token;
  }
}
