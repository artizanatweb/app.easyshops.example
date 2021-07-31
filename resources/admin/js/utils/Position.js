class Position {
    constructor(latitude = 44.439663, longitude = 26.096306) {
        this.lat = latitude;
        this.lng = longitude;
    }

    set(name, value = null) {
        if (!(value > 0)) {
            return;
        }

        if (!["lat","lng"].includes(name)) {
            return;
        }

        if ("lat" === name) {
            this.lat = value;
        }

        if ("lng" === name) {
            this.lng = value;
        }
    }
}

export default Position;
