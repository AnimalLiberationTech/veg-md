import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    titleKey: "whyVegan",
    newTab: false,
    submenu: [
      {
        id: 11,
        titleKey: "animals",
        path: "/animals",
        newTab: false,
      },
      {
        id: 12,
        titleKey: "health",
        path: "/health",
        newTab: false,
      },
      {
        id: 13,
        titleKey: "planet",
        path: "/planet",
        newTab: false,
      },
    ],
  },
  {
    id: 2,
    titleKey: "resources",
    newTab: false,
    submenu: [
      {
        id: 21,
        titleKey: "recipes",
        path: "/recipes",
        newTab: false,
      },
      {
        id: 22,
        titleKey: "socialMedia",
        path: "/social-media",
        newTab: false,
      },
    ]
  },
  {
    id: 3,
    titleKey: "community",
    path: "/about",
    newTab: false,
  },
];
export default menuData;
