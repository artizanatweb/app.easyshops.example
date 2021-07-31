import * as paths from "./paths";

/* ICONS */
import DashboardIcon from '@material-ui/icons/Dashboard';
import UsersIcon from '@material-ui/icons/People';
import StoreIcon from '@material-ui/icons/Store';
import ServiceTemplateIcon from '@material-ui/icons/PostAdd';
import ProfileIcon from '@material-ui/icons/AccountCircle';
import ServicesIcon from '@material-ui/icons/Apps';
import PortfolioIcon from '@material-ui/icons/Work';

/* PAGES */
import DashboardPage from "./../pages/DashboardPage";
import UsersPage from "./../pages/UsersPage";
import ShopsPage from "../pages/ShopsPage";
import ServiceTemplatesPage from "./../pages/ServiceTemplatesPage";
import ServicesPage from "./../pages/ServicesPage";
import ProfilePage from "./../pages/ProfilePage";
import ShopDetailsPage from "../pages/ShopDetailsPage";
import PortfolioPage from "./../pages/PortfolioPage";

class Pages {
    constructor() {
        this.pages = {
            dashboard: {
                icon: <DashboardIcon />,
                name: "Dashboard",
                path: "/admin/dashboard",
                api: "/admin/api/dashboard",
                component: DashboardPage,
            },
            shops: {
                icon: <StoreIcon />,
                name: "Shops",
                path: "/admin/shops",
                api: "/admin/api/shops",
                component: ShopsPage,
            },
            shopDetails: {
                icon: <StoreIcon />,
                name: "Shop Details",
                path: "/admin/shop-details",
                api: paths.shop.user,
                component: ShopDetailsPage,
            },
            users: {
                icon: <UsersIcon />,
                name: "Users",
                path: "/admin/users",
                api: "/admin/api/users",
                component: UsersPage,
            },
            serviceTemplates: {
                icon: <ServiceTemplateIcon />,
                name: "Service Templates",
                path: "/admin/service-templates",
                api: paths.serviceTemplates.list,
                component: ServiceTemplatesPage,
            },
            services: {
                icon: <ServicesIcon />,
                name: "Services",
                path: "/admin/services",
                api: paths.services.list,
                component: ServicesPage,
            },
            profile: {
                icon: <ProfileIcon />,
                name: "Profile",
                path: "/admin/profile",
                api: function (userId) {
                    return `/admin/api/user/${userId}/profile`;
                },
                component: ProfilePage,
            },
            portfolio: {
                icon: <PortfolioIcon />,
                name: "Portfolio",
                path: "/admin/portfolio",
                api: function (userId) {
                    return `/admin/api/portfolio/${userId}`;
                },
                component: PortfolioPage,
            },
        };

        this.typePages = {
            1: [
                'dashboard',
                'shops',
                'users',
                'serviceTemplates',
                'services',
            ],
            2: [
                'dashboard',
                'shopDetails',
                'profile',
                'services',
            ],
            3: [
                'dashboard',
                'portfolio',
                'profile',
            ],
            4: [
                'dashboard',
                'portfolio',
                'profile',
            ],
        };

        this.userPages = null;
        this.userType = null;
    }

    getPages(user = null) {
        if (!user) {
            return null;
        }

        let userType = user.type;
        let strUserType = `${userType}`;

        if (!Object.keys(this.typePages).includes(strUserType)) {
            return null;
        }

        if (userType === this.userType && this.userPages?.length > 0) {
            return this.userPages;
        }

        this.userType = userType;

        this.userPages = [];
        this.typePages[userType].forEach((code) => {
            if (!this.pages.hasOwnProperty(code)) {
                return;
            }

            let page = this.pages[code];
            page.code = code;
            if ("profile" === code && page.api instanceof Function) {
                let apiAddress = page.api(user.id);
                page.api = apiAddress;
            }
            if (["services","shopDetails"].includes(code)) {
                if (page.api instanceof Function) {
                    page.api = page.api(user.shop_id);
                }
            }
            if ("services" === code && 1 === userType) {
                page.api = null;
            }

            this.userPages.push(page);
        });

        return this.userPages;
    }

    getByPathname(path) {
        if (!(this.userPages?.length > 0)) {
            return null;
        }

        if ("/admin" === path) {
            return this.userPages.find(page => "dashboard" === page.code);
        }

        return this.userPages.find(page => page.path === path);
    }

    getByCode(code) {
        if (!this.pages.hasOwnProperty(code)) {
            return null;
        }

        return this.pages[code];
    }

    reset() {
        this.userPages = null;
        this.userType = null;
    }
}

export default new Pages();
