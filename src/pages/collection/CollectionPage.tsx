import { Play, SlidersHorizontal } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { Badge, Card, Progress, SectionHeader } from "../../components/ui/Card";
import { tasks, trendData } from "../../services/mockData";

export function CollectionPage() {
  return (
    <div className="page">
      <div className="page-title"><div><span>采集策略管理</span><h1>最小必要数据采集任务</h1></div><button className="primary icon-text"><SlidersHorizontal size={16} />新建策略</button></div>
      <Card>
        <SectionHeader title="采集任务表格" />
        <table>
          <thead><tr><th>任务ID</th><th>目标系统</th><th>目标能力</th><th>采集模式</th><th>频率</th><th>状态</th><th>成功率</th><th>操作</th></tr></thead>
          <tbody>{tasks.map((task) => <tr key={task.id}><td>{task.id}</td><td>{task.system}</td><td>{task.capability}</td><td><Badge tone="blue">{task.mode}</Badge></td><td>{task.frequency}</td><td>{task.status}</td><td><Progress value={task.successRate} /></td><td><button className="ghost icon-text"><Play size={14} />执行</button></td></tr>)}</tbody>
        </table>
      </Card>
      <div className="two-col">
        <Card>
          <SectionHeader title="过去1小时采集成功率" />
          <ResponsiveContainer width="100%" height={230}><LineChart data={trendData}><Tooltip contentStyle={{ background: "#111927", border: "1px solid #26364c" }} /><Line dataKey="success" stroke="#2adf9f" dot={false} /></LineChart></ResponsiveContainer>
        </Card>
        <Card>
          <SectionHeader title="失败任务快速排查" />
          <div className="remedy-card"><strong>COL-003 大坝安全监测系统</strong><span>最近失败：Modbus 站号响应超时 · 建议切换备用边缘节点重试。</span></div>
        </Card>
      </div>
    </div>
  );
}
