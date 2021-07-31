export const makeCode = (string = "") => {
    return string.trim().replace(/\s+/g, '-').replace(/[^A-Za-z0-9._-]/g, "").toLowerCase();
};

export const createFormErrorsObject = (responseData) => {
    const errorsObject = {};

    if (responseData && responseData.hasOwnProperty('errors')) {
        Object.keys(responseData.errors).forEach((field) => {
            errorsObject[field] = responseData.errors[field][0];
        });
    }

    return errorsObject;
}

export const getUserImage = (user) => {
    let userImage = "/assets/images/default.png";
    if (user.image?.length > 5) {
        userImage = user.image;
    }

    return userImage;
};

export const getUserThumbnail = (user) => {
    let userImage = "/assets/images/default.png";
    if (user.thumbnail?.length > 5) {
        userImage = user.thumbnail;
    }

    return userImage;
};

export const getItemDefaultAsset = (item) => {
    let itemImage = {
        thumbnail: '/assets/images/default.png',
        image: '/assets/images/default.png',
        name: 'Missing item image',
    };

    if (item.images?.length > 0) {
        itemImage = item.images[0];

        item.images.every((image) => {
            if (!image?.default) {
                return true;
            }

            itemImage = image;
        });
    }

    return itemImage;
};
