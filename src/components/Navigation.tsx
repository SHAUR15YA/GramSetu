import React from "react";
import {
  LayoutDashboard,
  Sprout,
  HeartPulse,
  GraduationCap,
  Landmark,
  CloudSun
} from "lucide-react";
import { ActiveDomain, LanguageCode } from "../types";
import { getTranslation } from "../data/translations";

interface NavigationProps {
  activeTab: ActiveDomain;
  onSelectTab: (tab: ActiveDomain) => void;
  currentLang: LanguageCode;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  currentLang
}) => {
  const navItems: { id: ActiveDomain; labelKey: string; icon: React.ReactNode; color: string }[] = [
    {
      id: "overview",
      labelKey: "overview",
      icon: <LayoutDashboard className="w-4 h-4" />,
      color: "emerald"
    },
    {
      id: "agriculture",
      labelKey: "agriculture",
      icon: <Sprout className="w-4 h-4" />,
      color: "amber"
    },
    {
      id: "healthcare",
      labelKey: "healthcare",
      icon: <HeartPulse className="w-4 h-4" />,
      color: "rose"
    },
    {
      id: "education",
      labelKey: "education",
      icon: <GraduationCap className="w-4 h-4" />,
      color: "blue"
    },
    {
      id: "government",
      labelKey: "government",
      icon: <Landmark className="w-4 h-4" />,
      color: "purple"
    },
    {
      id: "environment",
      labelKey: "environment",
      icon: <CloudSun className="w-4 h-4" />,
      color: "teal"
    }
  ];

  return (
    <nav id="domain-navigation-bar" className="bg-white border-b border-stone-200 sticky top-[73px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                  isActive
                    ? "bg-emerald-800 text-white shadow-xs font-semibold"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100 bg-transparent"
                }`}
              >
                <span className={isActive ? "text-emerald-300" : "text-stone-500"}>
                  {item.icon}
                </span>
                <span>{getTranslation(currentLang, item.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
