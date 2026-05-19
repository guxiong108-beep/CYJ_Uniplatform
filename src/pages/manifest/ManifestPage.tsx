import { RefreshCw } from "lucide-react";
import { Badge, Card, SectionHeader } from "../../components/ui/Card";
import { integrations } from "../../services/mockData";

const fields = [
  ["operStatus", "运行状态", "enum", "-", true],
  ["activePower", "有功功率", "number", "MW", true],
  ["breakerCurrent", "操作电流", "number", "A", true],
  ["debugFrameCount", "调试帧计数", "number", "-", false]
];

export function ManifestPage() {
  return (
    <div className="page split-layout">
      <Card className="list-panel">
        <SectionHeader title="能力声明列表" />
        {integrations.map((system) => <button key={system.id} className={system.id === "sys-protect" ? "active" : ""}><strong>{system.name}</strong><span>{system.manifestStatus} · 8项能力</span></button>)}
      </Card>
      <Card>
        <SectionHeader title="能力详情" action={<button className="ghost icon-text"><RefreshCw size={16} />AI重新提炼必要字段</button>} />
        <div className="capability-tree">
          <h2>继电保护装置管理系统</h2>
          <details open><summary>能力：getDeviceStatus</summary><p>协议 IEC61850 · 参数 deviceId, timeRange · 采集模式 事件订阅+轮询</p></details>
          <details open><summary>能力：getAlarmEvents</summary><p>协议 IEC104 · 返回归并前原始告警、遥信变位与保护动作事件。</p></details>
        </div>
        <table>
          <thead><tr><th>原始字段</th><th>统一字段</th><th>类型</th><th>单位</th><th>必要采集</th></tr></thead>
          <tbody>{fields.map((field) => <tr key={field[0] as string}><td>{field[0]}</td><td>{field[1]}</td><td>{field[2]}</td><td>{field[3]}</td><td><Badge tone={field[4] ? "online" : "neutral"}>{field[4] ? "是" : "否"}</Badge></td></tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}
