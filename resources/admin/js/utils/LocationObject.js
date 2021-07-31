import Position from "./Position";

class LocationObject {
    constructor() {
        this.id = 0;
        this.name = "";
        this.address = "";
        this.location = new Position();
        this.phone = "";
        this.email = "";
        this.updated_at = "";
        this.last_update = "";
    }

    fill(data) {
        if (data?.id > 0) {
            this.id = data.id;
        }

        if (data?.name?.length > 0) {
            this.name = data.name;
        }

        if (data?.address?.length > 0) {
            this.address = data.address;
        }

        if (data?.phone?.length > 0) {
            this.phone = data.phone;
        }

        if (data?.email?.length > 0) {
            this.email = data.email;
        }

        if (data?.location?.lat) {
            this.location.lat = data.location.lat;
        }
        if (data?.location?.lng) {
            this.location.lng = data.location.lng;
        }
    }
}

export default LocationObject;
