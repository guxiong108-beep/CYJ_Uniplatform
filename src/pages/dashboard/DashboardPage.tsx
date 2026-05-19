import { ArrowUpRight, Bot, CircleAlert, Database, GitFork, HardDrive, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { Badge, Card, Progress, SectionHeader } from "../../components/ui/Card";
import { alarms, devices, edgeNodes, integrations, trendData } from "../../services/mockData";
import { usePlatformStore } from "../../store/usePlatformStore";

const metrics = [
  { label: "发电量", value: "6,284 MWh", trend: "+8.7%", to: "/reports" },
  { label: "设备健康指数", value: "83.6%", trend: "-1.8%", to: "/devices" },
  { label: "告警处置率", value: "92.1%", trend: "+4.2%", to: "/alarm" },
  { label: "采集成功率", value: "98.4%", trend: "+0.6%", to: "/collection" },
  { label: "边缘在线数", value: "3 / 4", trend: "稳定", to: "/edge" },
  { label: "根因准确率", value: "91.7%", trend: "+2.1%", to: "/rootcause" }
];

export function DashboardPage() {
  const toggleAIChat = usePlatformStore((state) => state.toggleAIChat);
  const activeAlarms = alarms.filter((alarm) => alarm.status !== "closed").length;
  const onlineRate = Math.round((devices.filter((device) => device.status === "online").length / devices.length) * 100);

  return (
    <div className="page dashboard-grid">
      <section className={`global-status ${activeAlarms > 0 ? "pulse-alert" : ""}`}>
        <div><Zap size={20} /><span>全站设备</span><strong>{devices.length}</strong></div>
        <div><Database size={20} /><span>在线率</span><strong>{onlineRate}%</strong></div>
        <div><CircleAlert size={20} /><span>活跃告警</span><strong>{activeAlarms}</strong></div>
        <div><GitFork size={20} /><span>接入系统</span><strong>{integrations.length}</strong></div>
        <div><HardDrive size={20} /><span>今日采集</span><strong>35.9万</strong></div>
      </section>

      <section className="metric-grid">
        {metrics.map((metric) => (
          <Link to={metric.to} key={metric.label} className="metric-card">
            <div>
              <span>{metric.label}</span>
              <ArrowUpRight size={16} />
            </div>
            <strong>{metric.value}</strong>
            <em>{metric.trend}</em>
            <ResponsiveContainer width="100%" height={42}>
              <LineChart data={trendData}>
                <Line dataKey="health" stroke="#2adf9f" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Link>
        ))}
      </section>

      <Card className="topology-mini">
        <SectionHeader title="全站拓扑缩略图" action={<Link to="/topology">进入拓扑</Link>} />
        <div className="mini-map">
          {["中心级平台", "地下厂房", "35kV变电站", "坝面/库区", "施工区"].map((node, index) => (
            <Link to={`/topology?focus=${index}`} className={`mini-node n${index}`} key={node}>{node}</Link>
          ))}
        </div>
      </Card>

      <Card className="ai-widget">
        <SectionHeader title="AI 快速问答" />
        <p>直接描述运维问题，系统会结合设备状态、告警链路与采集策略生成分析。</p>
        <button className="primary icon-text" onClick={toggleAIChat}><Bot size={17} />打开 AI 分析</button>
      </Card>

      <Card className="live-panel">
        <SectionHeader title="实时归并告警" action={<Link to="/alarm">查看全部</Link>} />
        <div className="alarm-stream">
          {alarms.map((alarm) => (
            <Link to={`/alarm/${alarm.id}`} key={alarm.id} className="alarm-item">
              <Badge tone={alarm.severity.toLowerCase()}>{alarm.severity}</Badge>
              <strong>{alarm.rootCauseDescription}</strong>
              <span>{alarm.createdAt}</span>
              <Progress value={alarm.confidence * 100} tone="red" />
            </Link>
          ))}
        </div>
      </Card>

      <Card className="wide-chart">
        <SectionHeader title="过去24小时运行趋势" />
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trendData}>
            <Tooltip contentStyle={{ background: "#111927", border: "1px solid #26364c", color: "#f8fbff" }} />
            <Line dataKey="health" name="健康指数" stroke="#2adf9f" strokeWidth={2} dot={false} />
            <Line dataKey="success" name="采集成功率" stroke="#ffc857" strokeWidth={2} dot={false} />
            <Line dataKey="latency" name="边缘延迟" stroke="#6aa8ff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
