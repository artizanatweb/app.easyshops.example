import ImageReader from "./ImageReader";

class LocationAssetObject {
    constructor(type = 'image') {
        this.id = 0;
        this.location_id = 0;
        this.name = "";
        this.image = "";
        this.thumbnail = "";
        this.default = false;
        this.thumbnail = "";
        this.created_at = "";
        this.updated_at = "";
        this.asset_type_id = 1;
        this.last_update = "";
        // this.imageReader = null;
        this.uploadFile = null;
        this.createImageReaderFor(type);

        this.assetKey = Math.random().toString(36).substring(2, 15);
    }

    createImageReaderFor(type = 'image') {
        let imagePath = '/assets/svgs/default-image.svg';
        if ('video' === type) {
            imagePath = '/assets/svgs/default-video.svg';
        }

        this.imageReader = new ImageReader(imagePath);
    }

    fill(data) {
        if (data?.id > 0) {
            this.id = data.id;
        }

        if (data?.location_id > 0) {
            this.location_id = data.location_id;
        }

        if (data?.name?.length > 0) {
            this.name = data.name;
        }

        if (data?.image?.length > 0) {
            this.image = data.image;
        }

        if (data?.thumbnail?.length > 0) {
            this.thumbnail = data.thumbnail;
            this.imageReader = new ImageReader(data.thumbnail);
        }

        if (data.hasOwnProperty("default")) {
            this.default = (data.default) ? true : false;
        }

        if (data?.asset_type_id > 0) {
            this.asset_type_id = data.asset_type_id;
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

export default LocationAssetObject;
