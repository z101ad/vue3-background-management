export default [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(
        /* webpackChunkName: "login_home_welcome" */ "../views/login/index.vue"
      ),
  },
  {
    path: "/",
    name: "home",
    redirect: "/welcome",
    component: () =>
      import(
        /* webpackChunkName: "login_home_welcome" */ "../views/home/index.vue"
      ),
    children: [
      {
        path: "/welcome",
        component: () =>
          import(
            /* webpackChunkName: "login_home_welcome" */ "../views/welcome/Welcome.vue"
          ),
      },
      {
        path: "/users",
        component: () =>
          import(
            /* webpackChunkName: "Users_Rights_Roles" */ "../views/user/user.vue"
          ),
      },
      {
        path: "/roles",
        component: () =>
          import(
            /* webpackChunkName: "Users_Rights_Roles" */ "../views/power/Roles.vue"
          ),
      },
      {
        path: "/rights",
        component: () =>
          import(
            /* webpackChunkName: "Users_Rights_Roles" */ "../views/power/Rights.vue"
          ),
      },
      {
        path: "/goods",
        component: () =>
          import(
            /* webpackChunkName: "List_Cate_Params_Add" */ "../views/goods/List.vue"
          ),
      },
      {
        path: "/goods/add",
        component: () =>
          import(
            /* webpackChunkName: "List_Cate_Params_Add" */ "../views/goods/Add.vue"
          ),
      },
      {
        path: "/categories",
        component: () =>
          import(
            /* webpackChunkName: "List_Cate_Params_Add" */ "../views/goods/Cate.vue"
          ),
      },
      {
        path: "/params",
        component: () =>
          import(
            /* webpackChunkName: "List_Cate_Params_Add" */ "../views/goods/Params.vue"
          ),
      },
      {
        path: "/orders",
        component: () =>
          import(
            /* webpackChunkName: "Order_Report" */ "../views/order/Order.vue"
          ),
      },
      {
        path: "/reports",
        component: () =>
          import(
            /* webpackChunkName: "Order_Report" */ "../views/report/Report.vue"
          ),
      },
    ],
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: () =>
      import(/* webpackChunkName: "404" */ "../components/404.vue"),
  },
];
