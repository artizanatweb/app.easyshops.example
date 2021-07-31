import ImageReader from "./ImageReader";

class UserProfileObject {
    constructor() {
        this.id = 0;
        this.name = "";
        this.surname = "";
        this.email = "";
        this.password = "";
        this.phone = "";
        this.about_me = "";
        this.image = "";
        this.thumbnail = "";
        this.updated_at = "";
        this.last_update = "";

        this.createImageReader();
    }

    createImageReader() {
        let imagePath = '/assets/svgs/specialist.svg';

        this.imageReader = new ImageReader(imagePath);
    }

    fill(data) {
        if (data?.id > 0) {
            this.id = data.id;
        }

        if (data?.name?.length > 0) {
            this.name = data.name;
        }

        if (data?.surname?.length > 0) {
            this.surname = data.surname;
        }

        if (data?.email?.length > 0) {
            this.email = data.email;
        }

        if (data?.password?.length > 0) {
            this.password = data.password;
        }

        if (data?.phone?.length > 0) {
            this.phone = data.phone;
        }

        if (data?.about_me?.length > 0) {
            this.about_me = data.about_me;
        }

        if (data?.image?.length > 5) {
            this.image = data.image;
            this.imageReader = new ImageReader(data.image);
        }

        if (data?.thumbnail?.length > 5) {
            this.thumbnail = data.thumbnail;
        }

        if (data.hasOwnProperty("updated_at")) {
            this.updated_at = data.updated_at;
        }

        if (data.hasOwnProperty("last_update")) {
            this.last_update = data.last_update;
        }
    }
}

export default UserProfileObject;
