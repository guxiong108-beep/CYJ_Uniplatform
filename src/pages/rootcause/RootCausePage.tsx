import { Bot, FileDown } from "lucide-react";
import { Line, LineChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { PropagationChain } from "../../components/alarm/PropagationChain";
import { Badge, Card, Progress, SectionHeader } from "../../components/ui/Card";
import { alarms, trendData } from "../../services/mockData";

const radar = [
  { subject: "告警关联", value: 92 },
  { subject: "设备状态", value: 84 },
  { subject: "拓扑路径", value: 96 },
  { subject: "历史案例", value: 78 },
  { subject: "影响范围", value: 88 }
];

export function RootCausePage() {
  const event = alarms[0];
  return (
    <div className="page root-layout">
      <div className="page-title">
        <div><span>根因分析</span><h1>AI 推理、知识图谱与处置建议</h1></div>
        <select><option>{event.id} · P1 当前事件</option><option>{alarms[1].id} · P2 复盘事件</option></select>
      </div>
      <Card className="reasoning">
        <SectionHeader title="AI 推理过程" action={<Badge tone="p1">置信度 91%</Badge>} />
        {["收集相关告警", "关联设备状态", "拓扑路径分析", "历史缺陷匹配", "根因置信度评估"].map((step, index) => (
          <details key={step} open={index < 2} className="reason-step">
            <summary><Bot size={16} />Step {index + 1} {step}</summary>
            <p>已匹配 {event.rawAlarmIds.length + index} 条证据，关键设备状态与传播时间序列一致。</p>
          </details>
        ))}
        <div className="final-cause">
          <strong>#2主变35kV侧断路器 · 操作回路断线</strong>
          <Progress value={91} tone="red" />
        </div>
      </Card>
      <Card className="knowledge">
        <SectionHeader title="知识图谱" />
        <PropagationChain nodes={event.propagationChain} />
        <ResponsiveContainer width="100%" height={210}>
          <RadarChart data={radar}>
            <PolarGrid stroke="#25364e" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#9fb0c8", fontSize: 12 }} />
            <Radar dataKey="value" stroke="#2adf9f" fill="#2adf9f" fillOpacity={0.25} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
      <Card className="remediation">
        <SectionHeader title="处置建议" action={<button className="ghost icon-text"><FileDown size={16} />生成工单</button>} />
        {event.remediationSteps.map((step) => (
          <div className="remedy-card" key={step.id}>
            <strong>{step.action}</strong>
            <span>{step.role} · {step.duration}</span>
          </div>
        ))}
        <h3>历史同类缺陷</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={trendData.slice(0, 10)}>
            <Tooltip contentStyle={{ background: "#111927", border: "1px solid #26364c" }} />
            <Line dataKey="health" name="相似度" stroke="#ffc857" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
