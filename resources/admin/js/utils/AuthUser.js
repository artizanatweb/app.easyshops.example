class AuthUser {
    constructor() {
        this.id = null;
        this.name = null;
        this.surname = null;
        this.email = null;
        this.email_verified_at = null; // optional
        this.shop_id = 0; // optional
        this.type = 0;
    }

    set(jsonResponse) {
        if (!jsonResponse.hasOwnProperty('success')) {
            return false;
        }

        if (!jsonResponse.success) {
            return false;
        }

        if (!jsonResponse.hasOwnProperty('data')) {
            return false;
        }

        let responseData = jsonResponse.data;

        if (!responseData.hasOwnProperty('id')) {
            return false;
        }
        this.id = responseData.id;

        if (!responseData.hasOwnProperty('name')) {
            return false;
        }
        this.name = responseData.name;

        if (!responseData.hasOwnProperty('surname')) {
            return false;
        }
        this.surname = responseData.surname;

        if (!responseData.hasOwnProperty('email')) {
            return false;
        }
        this.email = responseData.email;

        if (responseData.hasOwnProperty('email_verified_at')) {
            this.email_verified_at = responseData.email_verified_at;
        }

        if (!responseData.hasOwnProperty('type')) {
            return false;
        }
        this.type = responseData.type;

        if (responseData?.shop_id > 0) {
            this.shop_id = responseData.shop_id;
        }

        return true;
    }
}

export default new AuthUser();
