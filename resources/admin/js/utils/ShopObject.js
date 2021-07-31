import ImageReader from "./ImageReader";

class ShopObject {
    constructor() {
        this.id = 0;
        this.slug = "";
        this.name = "";
        this.description = "";
        this.active = false;
        this.image = "";
        this.thumbnail = "";
        this.locations = [];
        this.updated_at = "";
        this.last_update = "";

        this.createImageReader();
    }

    createImageReader() {
        let imagePath = '/assets/svgs/building.svg';

        this.imageReader = new ImageReader(imagePath);
    }

    fill(data) {
        if (data?.id > 0) {
            this.id = data.id;
        }

        if (data?.slug?.length > 0) {
            this.slug = data.slug;
        }

        if (data?.name?.length > 0) {
            this.name = data.name;
        }

        if (data?.description?.length > 0) {
            this.description = data.description;
        }

        if (data.hasOwnProperty("active")) {
            this.active = (data.active) ? true : false;
        }

        if (data?.image?.length > 5) {
            this.image = data.image;
            this.imageReader = new ImageReader(data.image);
        }

        if (data.locations?.length > 0) {
            this.locations = data.locations;
        }

        if (data?.thumbnail?.length > 5) {
            this.thumbnail = data.thumbnail;
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
    }
}

export default ShopObject;
