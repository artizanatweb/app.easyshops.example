class AuthenticationRequestObject {
    constructor(email, password) {
        this.grant_type = 'password';
        this.client_id = process.env.MIX_ADMIN_CLIENT_ID;
        this.client_secret = process.env.MIX_ADMIN_CLIENT_SECRET;
        this.username = email;
        this.password = password;
    }
}

export default AuthenticationRequestObject;
