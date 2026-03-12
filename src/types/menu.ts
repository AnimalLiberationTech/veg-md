export type Menu = {
  id: number;
  titleKey: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};
