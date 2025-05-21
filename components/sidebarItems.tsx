export const sideBarItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    type: "divider",
  },
  // {
  //   label: "Analytics & Data",
  //   children: [
  //     { label: "Product Performance", href: "/dashboard/product-performance" },
  //     { label: "Order Statistics", href: "/dashboard/order-statistics" },
  //     { label: "Sales Overview", href: "/dashboard/sales" },
  //     { label: "Supplier Metrics", href: "/dashboard/supplier-metrics" },
  //   ],
  // },
  // {
  //   type: "divider",
  // },
  {
    label: "Merchandising",
    children: [
      { label: "Inventory", href: "/inventory" },
      { label: "Order", href: "/order" },
      { label: "Order History", href: "/orderHistory" },
      { label: "Supplier", href: "/supplier" },
      { label: "Store entry", href: "/entries" },
      { label: "Category", href: "/category" },
    ],
  },
  {
    type: "divider",
  },
  {
    label: "Settings",
    children: [
      { label: "Profile", href: "/profile" },
      { label: "Logout", href: "/logout" },
    ],
  },
];
