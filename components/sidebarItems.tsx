export const sideBarItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    type: "divider",
  },
  {
    label: "Analytics & Data",
    children: [
      { label: "Product Performance", href: "/dashboard/product-performance" },
      { label: "Order Statistics", href: "/dashboard/order-statistics" },
      { label: "Sales Overview", href: "/dashboard/sales" },
      { label: "Supplier Metrics", href: "/dashboard/supplier-metrics" },
      { label: "Returns & Refunds", href: "/dashboard/refunds" },
    ],
  },
  {
    type: "divider",
  },
  {
    label: "Merchandising",
    children: [
      { label: "Inventory", href: "/inventory" },
      { label: "Order", href: "/order" },
      { label: "Order History", href: "/order-history" },
      { label: "Supplier", href: "/supplier" },
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
