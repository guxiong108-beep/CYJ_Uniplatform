import { Power, RotateCw, ScrollText } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { Badge, Card, Progress, SectionHeader } from "../../components/ui/Card";
import { edgeNodes, trendData } from "../../services/mockData";

export function EdgePage() {
  return (
    <div className="page">
      <div className="page-title"><div><span>边缘节点管理</span><h1>两级架构与离岛自治状态</h1></div></div>
      <div className="edge-grid">
        {edgeNodes.map((node) => (
          <Card key={node.id} className="edge-card">
            <Badge tone={node.online ? "online" : "danger"}>{node.online ? "在线" : "离线"}</Badge>
            {node.island && <Badge tone="yellow">离岛模式</Badge>}
            <h2>{node.name}</h2>
            <p>{node.location}</p>
            <div className="kv-row"><span>CPU</span><strong>{node.cpu}%</strong></div><Progress value={node.cpu} />
            <div className="kv-row"><span>内存</span><strong>{node.memory}%</strong></div><Progress value={node.memory} tone="yellow" />
            <div className="kv-row"><span>接入设备</span><strong>{node.devices} 台</strong></div>
            <div className="kv-row"><span>中心延迟</span><strong>{node.latency || "--"} ms</strong></div>
            <div className="button-row"><button className="ghost icon-text"><Power size={15} />下发</button><button className="ghost icon-text"><RotateCw size={15} />重启</button><button className="ghost icon-text"><ScrollText size={15} />日志</button></div>
          </Card>
        ))}
      </div>
      <Card>
        <SectionHeader title="实时资源指标" />
        <ResponsiveContainer width="100%" height={260}><LineChart data={trendData}><Tooltip contentStyle={{ background: "#111927", border: "1px solid #26364c" }} /><Line dataKey="latency" stroke="#6aa8ff" dot={false} /><Line dataKey="success" stroke="#2adf9f" dot={false} /></LineChart></ResponsiveContainer>
      </Card>
    </div>
  );
}
