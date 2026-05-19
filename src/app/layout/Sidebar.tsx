import {
  Activity,
  Bell,
  Bot,
  Boxes,
  Cable,
  ChartSpline,
  FileText,
  Gauge,
  GitFork,
  HardDrive,
  Home,
  Layers,
  Settings,
  Workflow
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { usePlatformStore } from "../../store/usePlatformStore";

const navItems = [
  { to: "/", label: "首页总览", icon: Home },
  { to: "/topology", label: "全站拓扑", icon: GitFork },
  { to: "/alarm", label: "告警中心", icon: Bell },
  { to: "/rootcause", label: "根因分析", icon: Bot },
  { to: "/devices", label: "设备资产", icon: Boxes },
  { to: "/integration", label: "系统接入", icon: Cable },
  { to: "/manifest", label: "能力声明", icon: Layers },
  { to: "/collection", label: "采集策略", icon: Workflow },
  { to: "/monitoring", label: "监控意图", icon: ChartSpline },
  { to: "/edge", label: "边缘节点", icon: HardDrive },
  { to: "/reports", label: "报告中心", icon: FileText },
  { to: "/settings", label: "系统设置", icon: Settings }
];

export function Sidebar() {
  const unreadCount = usePlatformStore((state) => state.unreadCount);

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Gauge size={24} /></div>
        <div>
          <strong>水电智管</strong>
          <span>Hydro AI Ops</span>
        </div>
      </div>
      <nav>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
              <Icon size={18} />
              <span>{item.label}</span>
              {item.to === "/alarm" && unreadCount > 0 && <em>{unreadCount}</em>}
            </NavLink>
          );
        })}
      </nav>
      <div className="sidebar-foot">
        <Activity size={18} />
        <div>
          <strong>实时链路正常</strong>
          <span>WebSocket 延迟 86ms</span>
        </div>
      </div>
    </aside>
  );
}
