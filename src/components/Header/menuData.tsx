import { Menu } from "@/types/menu";
import {veganMoldovaTgGroupUrl} from "@/constants";

const menuData: Menu[] = [
  {
    id: 1,
    titleKey: "whyVegan",
    newTab: false,
    submenu: [
      {
        id: 11,
        titleKey: "animals",
        path: "/why-vegan/animals",
        newTab: false,
      },
      {
        id: 12,
        titleKey: "health",
        path: "/why-vegan/health",
        newTab: false,
      },
      {
        id: 13,
        titleKey: "planet",
        path: "/why-vegan/planet",
        newTab: false,
      },
    ],
  },
  {
    id: 2,
    titleKey: "goingVegan",
    newTab: false,
    submenu: [
      {
        id: 21,
        titleKey: "products",
        newTab: true,
        newTabUrl: "https://postul.vegan.md",
      },
      // {
      //   id: 22,
      //   titleKey: "recipes",
      //   path: "/recipes",
      //   newTab: false,
      // },
      // {
      //   id: 23,
      //   titleKey: "socialMedia",
      //   path: "/social-media",
      //   newTab: false,
      // },
    ]
  },
  {
    id: 3,
    titleKey: "community",
    newTab: false,
    submenu: [
      {
        id: 31,
        titleKey: "values",
        path: "/community/values",
        newTab: false,
      },
      {
        id: 32,
        titleKey: "activities",
        path: "/community/activities",
        newTab: false,
      },
      {
        id: 33,
        titleKey: "partnersAndFriends",
        path: "/community/friends",
        newTab: false,
      },
      {
        id: 34,
        titleKey: "weInTelegram",
        newTab: true,
        newTabUrl: veganMoldovaTgGroupUrl,
      },
    ]
  },
];
export default menuData;
