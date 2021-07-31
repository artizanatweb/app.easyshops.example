export const authentication = {
    token: '/oauth/token',
    refresh: '/oauth/token/refresh',
    remove: function (tokenId) {
        return `/oauth/tokens/${tokenId}`;
    },
    user: '/admin/api/auth/user',
};

export const users = {
    create: '/admin/api/users',
    update: (id) => {
        return `/admin/api/users/${id}`;
    },
    delete: (id) => {
        return `/admin/api/users/${id}`;
    },
    show: (id) => {
        return `/admin/api/users/${id}`;
    },
    types: '/admin/api/users/types',
};

export const user = {
    show: (id) => {
        return `/admin/api/user/${id}/profile/show`;
    },
    update: (id) => {
        return `/admin/api/user/${id}/profile/update`;
    },
};

export const shop = {
    create: '/admin/api/shops',
    update: (id) => {
        return `/admin/api/shops/${id}`;
    },
    delete: (id) => {
        return `/admin/api/shops/${id}`;
    },
    show: (id) => {
        return `/admin/api/shops/${id}`;
    },
    details: (slug) => {
        return `/admin/api/shops/${slug}/details`;
    },
    items: '/admin/api/shops/list/select',
    get: (id) => {
        return `/admin/api/details/shop/${id}`;
    },
    user: (id) => {
         return `/admin/api/user/shop/${id}`;
    }
};

export const locations = {
    list: (shopId) => {
        return `/admin/api/shop/${shopId}/locations`;
    },
    create: (shopId) => {
        return `/admin/api/shop/${shopId}/locations`;
    },
    update: (shopId, locationId) => {
        return `/admin/api/shop/${shopId}/locations/${locationId}`;
    },
    delete: (shopId, locationId) => {
        return `/admin/api/shop/${shopId}/locations/${locationId}`;
    },
    show: (shopId, locationId) => {
        return `/admin/api/shop/${shopId}/locations/${locationId}`;
    },
    counties: '/admin/api/counties',
    items: '/admin/api/locations/list/select',
};

export const location = {
    placePhotos: '/admin/api/maps/place/photos',
};

export const serviceTemplates = {
    list: '/admin/api/service-templates',
    create: '/admin/api/service-templates',
    update: (id) => {
        return `/admin/api/service-templates/${id}`;
    },
    delete: (id) => {
        return `/admin/api/service-templates/${id}`;
    },
    show: (id) => {
        return `/admin/api/service-templates/${id}`;
    },
    items: '/admin/api/service-templates/list/items',
};

export const services = {
    list: (shopId) => {
        return `/admin/api/shop/${shopId}/services`;
    },
    create: (shopId) => {
        return `/admin/api/shop/${shopId}/services`;
    },
    update: (shopId,id) => {
        return `/admin/api/shop/${shopId}/services/${id}`;
    },
    delete: (shopId,id) => {
        return `/admin/api/shop/${shopId}/services/${id}`;
    },
    show: (shopId,id) => {
        return `/admin/api/shop/${shopId}/services/${id}`;
    },
};
