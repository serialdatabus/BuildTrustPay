"use client";
import { FaUser } from "react-icons/fa";
export default function DashboardLayout({ children }) {
  const menuitems = [
    {
      name: "Projects",
      href: "/dashboard/projects",
      key: "1",
      icon: <FaUser />,
    },
    {
        name: "Projects",
        href: "/dashboard/projects",
        key: "2",
        icon: <FaUser />,
      },
      {
        name: "Projects",
        href: "/dashboard/projects",
        icon: <FaUser />,
        key: "3",
      },
      {
        name: "Projects",
        href: "/dashboard/projects",
        icon: <FaUser />,
        key: "4",
      },
      {
        name: "Projects",
        href: "/dashboard/projects",
        icon: <FaUser />,
        key: "5",
      },
  ];

  return (
    <div className="flex h-screen w-full">
      <div className="w-[20em] bg-gray-400 h-full">
      {/* list menu items */}
        {menuitems.map((item) => (
            <a href="" key={item.key} className="flex p-2 items-center">
                <span>{item.icon}</span>
                <span className="ml-2">{item.name}</span>
            </a> ))}
      </div>
      <div>{children}</div>
    </div>
  );
}
