import { Bell, Bot, Search, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { alarms, devices, integrations } from "../../services/mockData";
import { usePlatformStore } from "../../store/usePlatformStore";

export function Topbar() {
  const { unreadCount, toggleAIChat } = usePlatformStore();
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const keyword = query.toLowerCase();
    return [
      ...devices.filter((item) => `${item.name}${item.assetCode}`.toLowerCase().includes(keyword)).map((item) => ({ label: item.name, to: `/devices/${item.id}`, type: "设备" })),
      ...alarms.filter((item) => `${item.id}${item.rootCauseDescription}`.toLowerCase().includes(keyword)).map((item) => ({ label: item.id, to: `/alarm/${item.id}`, type: "告警" })),
      ...integrations.filter((item) => item.name.toLowerCase().includes(keyword)).map((item) => ({ label: item.name, to: "/integration", type: "系统" }))
    ].slice(0, 6);
  }, [query]);

  return (
    <header className="topbar">
      <div className="search">
        <Search size={17} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索设备、告警、接入系统或报告" />
        {results.length > 0 && (
          <div className="search-popover">
            {results.map((item) => (
              <Link key={`${item.type}-${item.label}`} to={item.to} onClick={() => setQuery("")}>
                <span>{item.type}</span>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      <button className="ghost icon-text" onClick={toggleAIChat}><Bot size={17} />AI 助手</button>
      <button className="notification" aria-label="通知中心">
        <Bell size={18} />
        {unreadCount > 0 && <span>{unreadCount}</span>}
      </button>
      <div className="user-chip">
        <UserRound size={18} />
        <span>运维工程师</span>
      </div>
    </header>
  );
}
