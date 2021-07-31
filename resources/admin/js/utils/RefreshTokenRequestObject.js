class RefreshTokenRequestObject {
    constructor(refreshToken) {
        this.grant_type = 'refresh_token';
        this.client_id = process.env.MIX_ADMIN_CLIENT_ID;
        this.client_secret = process.env.MIX_ADMIN_CLIENT_SECRET;
        this.refresh_token = refreshToken;
    }

}

export default RefreshTokenRequestObject;
