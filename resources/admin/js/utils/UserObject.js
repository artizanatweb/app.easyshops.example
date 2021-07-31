import ImageReader from "./ImageReader";

class UserObject {
    constructor() {
        this.id = 0;
        this.name = "";
        this.surname = "";
        this.email = "";
        this.password = "";
        this.phone = "";
        this.about_me = "";
        this.user_type_id = 0;
        this.shop_id = 0;
        this.shop = null;
        this.location_id = 0;
        this.location = null;
        this.image = "";
        this.thumbnail = "";
        this.active = false;
        this.created_at = "";
        this.updated_at = "";
        this.last_update = "";
        this.type = null;

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

        if (data?.user_type_id > 0) {
            this.user_type_id = data.user_type_id;
        }

        if (data?.image?.length > 5) {
            this.image = data.image;
            this.imageReader = new ImageReader(data.image);
        }

        if (data?.thumbnail?.length > 5) {
            this.thumbnail = data.thumbnail;
        }

        if (data.hasOwnProperty("active")) {
            this.active = (data.active) ? true : false;
        }

        if (data.hasOwnProperty("created_at")) {
            this.created_at = data.created_at;
        }

        if (data.hasOwnProperty("updated_at")) {
            this.updated_at = data.updated_at;
        }

        if (data.hasOwnProperty("last_update")) {
            this.last_update = data.last_update;
        }

        if (typeof data?.type === 'object' && null !== data?.type ) {
            this.type = data.type;
            if (!(this.user_type_id > 0)) {
                this.user_type_id = data.type.id;
            }
        }

        if (data?.shop?.id > 0) {
            this.shop = data.shop;
            this.shop_id = data.shop.id;
        }

        if (data?.location?.id > 0) {
            this.location = data.location;
            this.location_id = data.location.id;
        }
    }
}

export default UserObject;
