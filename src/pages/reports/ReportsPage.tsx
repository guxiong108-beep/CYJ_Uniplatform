import { Download, Share2 } from "lucide-react";
import { Badge, Card, SectionHeader } from "../../components/ui/Card";

const reports = [
  ["今日运营简报", "日常运营简报", "自动", "2026-05-18 08:00", "已生成"],
  ["P1事件根因分析报告", "根因分析报告", "手动", "2026-05-18 19:20", "已生成"],
  ["5月设备健康评估", "设备健康评估", "自动", "2026-05-01 08:00", "待复核"]
];

export function ReportsPage() {
  return (
    <div className="page reports-layout">
      <Card className="list-panel">
        <SectionHeader title="报告类型" />
        {["日常运营简报", "告警分析报告", "根因分析报告", "设备健康评估", "接入系统状态"].map((item, index) => <button key={item} className={index === 0 ? "active" : ""}>{item}</button>)}
      </Card>
      <Card>
        <SectionHeader title="报告列表" />
        <table><thead><tr><th>报告名称</th><th>类型</th><th>生成方式</th><th>生成时间</th><th>状态</th><th>操作</th></tr></thead><tbody>
          {reports.map((report) => <tr key={report[0]}><td>{report[0]}</td><td>{report[1]}</td><td>{report[2]}</td><td>{report[3]}</td><td><Badge tone="online">{report[4]}</Badge></td><td><button className="ghost icon-text"><Download size={14} />PDF</button><button className="ghost icon-text"><Share2 size={14} />分享</button></td></tr>)}
        </tbody></table>
      </Card>
      <Card className="report-preview">
        <SectionHeader title="报告预览" action={<button className="primary">重新生成</button>} />
        <div className="paper">
          <h2>水电站今日运营简报</h2>
          <p>今日全站发电量 6,284 MWh，采集成功率 98.4%，活跃归并告警 2 起，其中 P1 事件 1 起。</p>
          <p>AI 建议：优先处理 #2主变35kV侧断路器操作回路异常，并对坝肩渗压趋势执行现场复核。</p>
        </div>
      </Card>
    </div>
  );
}
