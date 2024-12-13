import React from "react";
import { Navigate, Route, RouteProps } from "react-router-dom";

// components
import PrivateRoute from "./PrivateRoute";

import Owner from "@/pages/apps/Owner/Owner";
import Restaurant from "@/pages/apps/Restaurant/Restaurant";
import Restaurants from "@/pages/apps/Owner/Restaurants/Restaurants";
import Search from "@/pages/apps/RestaurantSearch/RestaurantSearch";
import Users from "@/pages/apps/Users/Users";
import DashBoard from "@/pages/apps/Dashboard/DashBoard";

// lazy load all the views

// auth
const Login = React.lazy(() => import("../pages/auth/Login"));
const Register = React.lazy(() => import("../pages/auth/Register"));
const Logout = React.lazy(() => import("../pages/auth/Logout"));
const RecoverPassword = React.lazy(
  () => import("../pages/auth/RecoverPassword")
);
const LockScreen = React.lazy(() => import("../pages/auth/LockScreen"));
const ConfirmMail = React.lazy(() => import("../pages/auth/ConfirmMail"));


// dashboard
const Ecommerce = React.lazy(() => import("../pages/dashboard/ecommerce/"));
const Analytics = React.lazy(() => import("../pages/dashboard/Analytics/"));


// pages
const ProfilePages = React.lazy(() => import("../pages/other/Profile/"));
const InvoicePages = React.lazy(() => import("../pages/other/Invoice"));
const FAQPages = React.lazy(() => import("../pages/other/FAQ"));
const PricingPages = React.lazy(() => import("../pages/other/Pricing"));
const MaintenancePages = React.lazy(() => import("../pages/other/Maintenance"));
const StarterPages = React.lazy(() => import("../pages/other/Starter"));
const TimelinePages = React.lazy(() => import("../pages/other/Timeline"));

// base ui
const Accordions = React.lazy(() => import("../pages/ui/Accordions"));
const Alerts = React.lazy(() => import("../pages/ui/Alerts"));
const Avatars = React.lazy(() => import("../pages/ui/Avatars"));
const Badges = React.lazy(() => import("../pages/ui/Badges"));
const Breadcrumb = React.lazy(() => import("../pages/ui/Breadcrumb"));
const Buttons = React.lazy(() => import("../pages/ui/Buttons"));
const Cards = React.lazy(() => import("../pages/ui/Cards"));
const Collapse = React.lazy(() => import("../pages/ui/Collapse"));
const Dropdowns = React.lazy(() => import("../pages/ui/Dropdowns"));
const Dismissible = React.lazy(() => import("../pages/ui/Dismissible"));
const Ratio = React.lazy(() => import("../pages/ui/Ratio"));
const ListGroup = React.lazy(() => import("../pages/ui/ListGroup"));
const Modals = React.lazy(() => import("../pages/ui/Modals"));
const Offcanvas = React.lazy(() => import("../pages/ui/Offcanvas"));
const Skeleton = React.lazy(() => import("../pages/ui/Skeleton"));
const Popovers = React.lazy(() => import("../pages/ui/Popovers"));
const Progress = React.lazy(() => import("../pages/ui/Progress"));
const Spinners = React.lazy(() => import("../pages/ui/Spinners"));
//const Tabs = React.lazy(() => import("../pages/ui/Tabs"));
const Tooltips = React.lazy(() => import("../pages/ui/Tooltips"));
const Typography = React.lazy(() => import("../pages/ui/Typography"));

// extended ui
//const SwiperPage = React.lazy(() => import("../pages/extended/SwiperPage"));
//const NestableList = React.lazy(() => import("../pages/extended/NestableList"));
//const Ratings = React.lazy(() => import("../pages/extended/Ratings"));
//const Player = React.lazy(() => import("../pages/extended/Player"));
//const Scrollbar = React.lazy(() => import("../pages/extended/Scrollbar"));
//const Tooltip = React.lazy(() => import("../pages/extended/Tooltip"));

// icons
const RemixIcons = React.lazy(() => import("../pages/ui/icons/RemixIcons"));

// apex charts
const AreaApex = React.lazy(
  () => import("../pages/charts/ApexCharts/AreaApex")
);
const BarApex = React.lazy(() => import("../pages/charts/ApexCharts/BarApex"));
const BoxPlotApex = React.lazy(
  () => import("../pages/charts/ApexCharts/BoxPlotApex")
);
const BubbleApex = React.lazy(
  () => import("../pages/charts/ApexCharts/BubbleApex")
);
const CandleStickApex = React.lazy(
  () => import("../pages/charts/ApexCharts/CandleStickApex")
);
const ColumnApex = React.lazy(
  () => import("../pages/charts/ApexCharts/ColumnApex")
);
const HeatApex = React.lazy(
  () => import("../pages/charts/ApexCharts/HeatApex")
);
const LineApex = React.lazy(
  () => import("../pages/charts/ApexCharts/LineApex")
);
const MixedApex = React.lazy(
  () => import("../pages/charts/ApexCharts/MixedApex")
);
const PieApex = React.lazy(() => import("../pages/charts/ApexCharts/PieApex"));
const PolarAreaApex = React.lazy(
  () => import("../pages/charts/ApexCharts/PolarAreaApex")
);
const RadarApex = React.lazy(
  () => import("../pages/charts/ApexCharts/RadarApex")
);
const RadialbarApex = React.lazy(
  () => import("../pages/charts/ApexCharts/RadialbarApex")
);
const ScatterApex = React.lazy(
  () => import("../pages/charts/ApexCharts/ScatterApex")
);
const SparklinesApex = React.lazy(
  () => import("../pages/charts/ApexCharts/SparklinesApex")
);
const TimelineApex = React.lazy(
  () => import("../pages/charts/ApexCharts/TimelineApex")
);
const TreemapApex = React.lazy(
  () => import("../pages/charts/ApexCharts/TreemapApex")
);

// chartjs charts
const AreaChartjs = React.lazy(
  () => import("../pages/charts/Chartjs/AreaChartjs")
);
const BarChartjs = React.lazy(
  () => import("../pages/charts/Chartjs/BarChartjs")
);
const LineChartjs = React.lazy(
  () => import("../pages/charts/Chartjs/LineChartjs")
);
const OtherChartjs = React.lazy(
  () => import("../pages/charts/Chartjs/OtherChartjs")
);

// forms

//const BasicElements = React.lazy(() => import("../pages/ui/forms/BasicElements"));
//const FormAdvanced = React.lazy(() => import("../pages/ui/forms/FormAdvanced"));
//const Validation = React.lazy(() => import("../pages/ui/forms/Validation"));
//const FormsLayout = React.lazy(() => import("../pages/ui/forms/FormsLayout"));
//const FileUploads = React.lazy(() => import("../pages/ui/forms/FileUploads"));
//const Editors = React.lazy(() => import("../pages/ui/forms/Editors"));

// tables
const BasicTables = React.lazy(() => import("../pages/ui/tables/BasicTables"));
const DataTables = React.lazy(() => import("../pages/ui/tables/DataTables"));

// maps
//const GoogleMaps = React.lazy(() => import("../pages/ui/maps/GoogleMaps"));
//const VectorMaps = React.lazy(() => import("../pages/ui/maps/VectorMaps"));

// error
const Error404 = React.lazy(() => import("../pages/error/Error404"));
const Error404Alt = React.lazy(() => import("../pages/error/Error404Alt"));
const Error500 = React.lazy(() => import("../pages/error/Error500"));

export interface RoutesProps {
  path: RouteProps["path"];
  name?: string;
  element?: RouteProps["element"];
  route?: any;
  exact?: boolean;
  icon?: string;
  header?: string;
  roles?: string[];
  children?: RoutesProps[];
}

// dashboards
const dashboardRoutes: RoutesProps = {
  path: "/",
  name: "Dashboards",
  icon: "home",
  header: "Navigation",
  element: <Navigate to="/apps/dashboard" />,
  children: [
    {
      path: "/apps",
      name: "Root",
      element: <Navigate to="/dashboard" />,
      route: PrivateRoute,
    },
    {
      path: "/apps/dashboard",
      name: "Dashboard",
      element: <DashBoard />,
      route: PrivateRoute,
    },
    
  ],
};


// const dashBoardRoutes: RoutesProps = {
//   path: "/apps/dashboard",
//   name: "Dashboard",
//   icon: "home",
//   header: "Navigation",
//   element: <DashBoard />,
// };

// Apps
const ownerAppRoutes: RoutesProps = {
  path: "/apps/owner",
  name: "Owner",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "Owner",
  element: <Owner />,
  header: "Apps",
  children: [
    {
      path: "/apps/owner/:id", // Updated to remove the leading slash
      name: "Restaurants",
      element: <Restaurants />,
      route: PrivateRoute,
    },
  ],
};

const restaurantAppRoutes: RoutesProps = {
  path: "/apps/restaurant",
  name: "Restaurant",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "calendar",
  element: <Restaurant />,
  header: "Apps",
};

const restaurantSearch: RoutesProps = {
  path: "/apps/hotel-search",
  name: "Restaurant Search",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "calendar",
  element: <Search />,
  header: "Apps",
};

const userManagement: RoutesProps = {
  path: "/apps/users",
  name: "User Management",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "calendar",
  element: <Users />,
  header: "Apps",
};



const appRoutes = [
  ownerAppRoutes,
  //dashBoardRoutes,
  restaurantAppRoutes,
  
  restaurantSearch,
  userManagement,
];

// pages
const customPagesRoutes = {
  path: "/pages",
  name: "Pages",
  icon: "pages",
  header: "Custom",
  children: [
    {
      path: "/pages/starter",
      name: "Starter Page",
      element: <StarterPages />,
      route: PrivateRoute,
    },
    {
      path: "/pages/profile",
      name: "Profile",
      element: <ProfilePages />,
      route: PrivateRoute,
    },
    {
      path: "/pages/timeline",
      name: "Timeline",
      element: <TimelinePages />,
      route: PrivateRoute,
    },
    {
      path: "/pages/invoice",
      name: "Invoice",
      element: <InvoicePages />,
      route: PrivateRoute,
    },
    {
      path: "/pages/faq",
      name: "FAQ",
      element: <FAQPages />,
      route: PrivateRoute,
    },
    {
      path: "/pages/pricing",
      name: "Pricing",
      element: <PricingPages />,
      route: PrivateRoute,
    },
    {
      path: "/error-404-alt",
      name: "Error - 404-alt",
      element: <Error404Alt />,
      route: PrivateRoute,
    },
  ],
};

// ui
const uiRoutes: RoutesProps = {
  path: "/ui",
  name: "Components",
  icon: "pocket",
  header: "UI Elements",
  children: [
    {
      path: "/ui/base",
      name: "Base UI",
      children: [
        {
          path: "/ui/accordions",
          name: "Accordions",
          element: <Accordions />,
          route: PrivateRoute,
        },
        {
          path: "/ui/alerts",
          name: "Alerts",
          element: <Alerts />,
          route: PrivateRoute,
        },
        {
          path: "/ui/avatars",
          name: "Avatars",
          element: <Avatars />,
          route: PrivateRoute,
        },
        {
          path: "/ui/buttons",
          name: "Buttons",
          element: <Buttons />,
          route: PrivateRoute,
        },
        {
          path: "/ui/badges",
          name: "Badges",
          element: <Badges />,
          route: PrivateRoute,
        },
        {
          path: "/ui/breadcrumb",
          name: "Breadcrumb",
          element: <Breadcrumb />,
          route: PrivateRoute,
        },
        {
          path: "/ui/cards",
          name: "Cards",
          element: <Cards />,
          route: PrivateRoute,
        },
        {
          path: "/ui/collapse",
          name: "Collapse",
          element: <Collapse />,
          route: PrivateRoute,
        },
        {
          path: "/ui/dismissible",
          name: "Dismissible",
          element: <Dismissible />,
          route: PrivateRoute,
        },
        {
          path: "/ui/dropdowns",
          name: "Dropdowns",
          element: <Dropdowns />,
          route: PrivateRoute,
        },
        {
          path: "/ui/progress",
          name: "Progress",
          element: <Progress />,
          route: PrivateRoute,
        },
        {
          path: "/ui/skeleton",
          name: "Skeleton",
          element: <Skeleton />,
          route: PrivateRoute,
        },
        {
          path: "/ui/spinners",
          name: "Spinners",
          element: <Spinners />,
          route: PrivateRoute,
        },
        {
          path: "/ui/list-group",
          name: "List Group",
          element: <ListGroup />,
          route: PrivateRoute,
        },
        {
          path: "/ui/ratio",
          name: "Ratio",
          element: <Ratio />,
          route: PrivateRoute,
        },
        
        {
          path: "/ui/modals",
          name: "Modals",
          element: <Modals />,
          route: PrivateRoute,
        },
        {
          path: "/ui/offcanvas",
          name: "Offcanvas",
          element: <Offcanvas />,
          route: PrivateRoute,
        },
        {
          path: "/ui/popovers",
          name: "Popovers",
          element: <Popovers />,
          route: PrivateRoute,
        },
        {
          path: "/ui/tooltips",
          name: "Tooltips",
          element: <Tooltips />,
          route: PrivateRoute,
        },
        {
          path: "/ui/typography",
          name: "Typography",
          element: <Typography />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: "/extended-ui",
      name: "Extended UI",
      children: [
       
      ],
    },
    {
      path: "/ui/icons",
      name: "Icons",
      children: [
        {
          path: "/ui/icons/remix-icons",
          name: "Remix Icons",
          element: <RemixIcons />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: "/ui/apexchart",
      name: "Apex Charts",
      children: [
        {
          path: "/ui/apex/area",
          name: "Area",
          element: <AreaApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/bar",
          name: "Bar",
          element: <BarApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/bubble",
          name: "Bubble",
          element: <BubbleApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/candlestick",
          name: "Candlestick",
          element: <CandleStickApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/column",
          name: "Column",
          element: <ColumnApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/heatmap",
          name: "Heatmap",
          element: <HeatApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/line",
          name: "Line",
          element: <LineApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/mixed",
          name: "Mixed",
          element: <MixedApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/timeline",
          name: "Timeline",
          element: <TimelineApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/boxplot",
          name: "Boxplot",
          element: <BoxPlotApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/treemap",
          name: "Treemap",
          element: <TreemapApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/pie",
          name: "Pie",
          element: <PieApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/radar",
          name: "Radar",
          element: <RadarApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/radialbar",
          name: "RadialBar",
          element: <RadialbarApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/scatter",
          name: "Scatter",
          element: <ScatterApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/polararea",
          name: "Polar Area",
          element: <PolarAreaApex />,
          route: PrivateRoute,
        },
        {
          path: "/ui/apex/sparklines",
          name: "Sparklines",
          element: <SparklinesApex />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: "/ui/chartjs",
      name: "Chartjs",
      children: [
        {
          path: "/ui/chartjs/area",
          name: "Area",
          element: <AreaChartjs />,
          route: PrivateRoute,
        },
        {
          path: "/ui/chartjs/bar",
          name: "Bar",
          element: <BarChartjs />,
          route: PrivateRoute,
        },
        {
          path: "/ui/chartjs/line",
          name: "Line",
          element: <LineChartjs />,
          route: PrivateRoute,
        },
        {
          path: "/ui/chartjs/other",
          name: "Other",
          element: <OtherChartjs />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: "/ui/forms",
      name: "Forms",
      children: [
        
        
      ],
    },
    {
      path: "/ui/tables",
      name: "Tables",
      children: [
        {
          path: "/ui/tables/basic-tables",
          name: "Basic Tables",
          element: <BasicTables />,
          route: PrivateRoute,
        },
        {
          path: "/ui/tables/data-tables",
          name: "Data Tables",
          element: <DataTables />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: "/ui/maps",
      name: "Maps",
      children: [
       
      ],
    },
  ],
};

// auth
const authRoutes: RoutesProps[] = [
  {
    path: "/auth/login",
    name: "Login",
    element: <Login />,
    route: Route,
  },

  {
    path: "/auth/register",
    name: "Register",
    element: <Register />,
    route: Route,
  },

  {
    path: "/auth/logout",
    name: "Logout",
    element: <Logout />,
    route: Route,
  },
  
  {
    path: "/auth/recover-password",
    name: "Recover Password",
    element: <RecoverPassword />,
    route: Route,
  },
  
  {
    path: "/auth/lock-screen",
    name: "Lock Screen",
    element: <LockScreen />,
    route: Route,
  },
  
  {
    path: "/auth/confirm-mail",
    name: "Confirm Mail",
    element: <ConfirmMail />,
    route: Route,
  },
  
];

// public routes
const otherPublicRoutes = [
  {
    path: "*",
    name: "Error - 404",
    element: <Error404 />,
    route: Route,
  },
  {
    path: "/error-404",
    name: "Error - 404",
    element: <Error404 />,
    route: Route,
  },
  {
    path: "/error-500",
    name: "Error - 500",
    element: <Error500 />,
    route: Route,
  },
  {
    path: "/pages/maintenance",
    name: "Maintenance",
    element: <MaintenancePages />,
    route: Route,
  },
];

// flatten the list of all nested routes
const flattenRoutes = (routes: RoutesProps[]) => {
  let flatRoutes: RoutesProps[] = [];

  routes = routes || [];
  routes.forEach((item: RoutesProps) => {
    flatRoutes.push(item);
    if (typeof item.children !== "undefined") {
      flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
    }
  });
  return flatRoutes;
};

// All routes
const authProtectedRoutes = [
  dashboardRoutes,
  ...appRoutes,
  customPagesRoutes,
  uiRoutes,
];
const publicRoutes = [...authRoutes, ...otherPublicRoutes];

const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes]);
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes]);
export {
  publicRoutes,
  authProtectedRoutes,
  authProtectedFlattenRoutes,
  publicProtectedFlattenRoutes,
};
