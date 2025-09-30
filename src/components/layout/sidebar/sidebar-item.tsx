import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface SidebarItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function SidebarItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={`walz-sidebar-item ${
        active ? "walz-sidebar-item-active" : ""
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-base font-medium">{label}</span>
    </div>
  );
}

interface SidebarItemWithBadgeProps {
  icon: any;
  label: string;
  badge: string;
  active?: boolean;
  onClick?: () => void;
}

export function SidebarItemWithBadge({
  icon: Icon,
  label,
  badge,
  active = false,
  onClick,
}: SidebarItemWithBadgeProps) {
  return (
    <div
      onClick={onClick}
      className={`${
        active ? "walz-sidebar-item-active" : "walz-sidebar-item"
      } justify-between`}
    >
      <div className="flex items-center gap-4">
        <Icon className="w-6 h-6" />
        <span className="text-base font-medium">{label}</span>
      </div>
      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-medium">
        {badge}
      </span>
    </div>
  );
}

interface CollapsibleSidebarItemProps {
  icon: any;
  label: string;
  isExpanded: boolean;
  onToggle: () => void;
  active?: boolean;
}

export function CollapsibleSidebarItem({
  icon: Icon,
  label,
  isExpanded,
  onToggle,
  active = false,
}: CollapsibleSidebarItemProps) {
  return (
    <div
      onClick={onToggle}
      className={`${
        active ? "walz-sidebar-item-active" : "walz-sidebar-item"
      } justify-between`}
    >
      <div className="flex items-center gap-4">
        <Icon className="w-6 h-6" />
        <span className="text-base font-medium">{label}</span>
      </div>
      <ChevronRight
        className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
          isExpanded ? "rotate-90" : "rotate-0"
        }`}
      />
    </div>
  );
}

interface SidebarSubItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function SidebarSubItem({
  label,
  active = false,
  onClick,
}: SidebarSubItemProps) {
  return (
    <div
      onClick={onClick}
      className={`text-sm py-2 px-3 ml-10 rounded transition-colors cursor-pointer ${
        active
          ? "text-blue-600 font-medium"
          : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {label}
    </div>
  );
}
