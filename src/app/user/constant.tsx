import { SideNavItem } from "@/types/types";
import {
  IconHome,
  IconBrush,
  IconPhoto,
  IconCube,
  IconDownload,
  IconSettings,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/user/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Draw Sketch",
    path: "/user/sketch",
    icon: <IconBrush width="24" height="24" />,
  },
  {
    title: "Generate Image",
    path: "/user/generate-image",
    icon: <IconPhoto width="24" height="24" />,
  },
  {
    title: "Generate 3D Model",
    path: "/user/generate-3d",
    icon: <IconCube width="24" height="24" />,
  },
];
