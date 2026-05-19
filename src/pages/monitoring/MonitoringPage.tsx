import { WandSparkles } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { Badge, Card, SectionHeader } from "../../components/ui/Card";
import { trendData } from "../../services/mockData";

export function MonitoringPage() {
  return (
    <div className="page split-layout">
      <Card className="list-panel">
        <SectionHeader title="监控意图" action={<button className="ghost">新建</button>} />
        {["地下厂房旋转设备振动预警", "坝肩渗压趋势监控", "保护装置动作链路监测"].map((item, index) => <button key={item} className={index === 0 ? "active" : ""}><strong>{item}</strong><span>AI生成 · {index + 4}台设备</span></button>)}
      </Card>
      <Card>
        <SectionHeader title="自然语言意图工作区" action={<Badge tone="online">推荐</Badge>} />
        <textarea defaultValue="监控地下厂房所有旋转设备的振动趋势，振动超过阈值时提前预警，并生成可发布到首页的大屏视图。" />
        <button className="primary icon-text"><WandSparkles size={16} />AI 解析</button>
        <div className="analysis-box">
          <p>✓ 识别目标：地下厂房 → 水轮机 / 发电机 / 冷却风机</p>
          <p>✓ 识别指标：振动加速度、轴承温度、趋势斜率</p>
          <p>✓ 自动生成采集策略：每 10 秒采集一次，异常提前 30 分钟预测</p>
        </div>
        <SectionHeader title="生成视图预览" />
        <ResponsiveContainer width="100%" height={260}><LineChart data={trendData}><Tooltip contentStyle={{ background: "#111927", border: "1px solid #26364c" }} /><Line dataKey="vibration" stroke="#ffc857" dot={false} /><Line dataKey="health" stroke="#2adf9f" dot={false} /></LineChart></ResponsiveContainer>
      </Card>
    </div>
  );
}
