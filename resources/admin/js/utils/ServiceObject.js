class ServiceObject {
    constructor() {
        this.id = 0;
        this.service_template_id = 0;
        this.shop_id = 0;
        this.name = "";
        this.description = "";
        this.duration = 0;
        this.price = 0;
        this.created_at = "";
        this.updated_at = "";
        this.last_update = "";
    }

    fill(data) {
        if (data?.id > 0) {
            this.id = data.id;
        }

        if (data?.service_template_id > 0) {
            this.service_template_id = data.service_template_id;
        }

        if (data?.shop_id > 0) {
            this.shop_id = data.shop_id;
        }

        if (data?.name?.length > 0) {
            this.name = data.name;
        }

        if (data?.description?.length > 0) {
            this.description = data.description;
        }

        if (data?.duration > 0) {
            this.duration = data.duration;
        }

        if (data?.price > 0) {
            this.price = data.price;
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

export default ServiceObject;
