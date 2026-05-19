import { Download, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PropagationChain } from "../../components/alarm/PropagationChain";
import { Badge, Card, Progress, SectionHeader } from "../../components/ui/Card";
import { alarms, devices } from "../../services/mockData";
import type { AlarmEvent } from "../../types";

function AlarmDetail({ event }: { event: AlarmEvent }) {
  const device = devices.find((item) => item.id === event.rootCauseDeviceId);
  return (
    <div className="alarm-detail">
      <div className="summary-card">
        <div><span>根因设备</span><strong>{device?.name ?? event.rootCauseDeviceId}</strong></div>
        <div><span>根因判断</span><strong>{event.rootCauseDescription}</strong></div>
        <div><span>影响范围</span><strong>{event.impactDescription}</strong></div>
        <Progress value={event.confidence * 100} tone="red" />
      </div>
      <h3>传播链路</h3>
      <PropagationChain nodes={event.propagationChain} />
      <h3>处置建议</h3>
      <div className="step-list">
        {event.remediationSteps.map((step, index) => (
          <label key={step.id} className="step-card">
            <input type="checkbox" />
            <strong>{index + 1}. {step.action}</strong>
            <span>{step.role} · 预计 {step.duration}</span>
          </label>
        ))}
      </div>
      <div className="button-row">
        <button className="primary">派单</button>
        <button className="ghost">标记处理中</button>
        <button className="ghost icon-text"><FileText size={16} />生成根因报告</button>
      </div>
    </div>
  );
}

export function AlarmPage() {
  const [selectedId, setSelectedId] = useState(alarms[0].id);
  const selected = useMemo(() => alarms.find((event) => event.id === selectedId) ?? alarms[0], [selectedId]);

  return (
    <div className="page alarm-layout">
      <div className="page-title">
        <div>
          <span>告警中心</span>
          <h1>归并事件与处置闭环</h1>
        </div>
        <button className="ghost icon-text"><Download size={16} />导出 CSV</button>
      </div>
      <div className="stat-strip">
        {["P1", "P2", "P3", "今日新增", "今日关闭"].map((item, index) => <Card key={item}><span>{item}</span><strong>{index < 3 ? index + 1 : index === 3 ? 18 : 11}</strong></Card>)}
      </div>
      <Card className="alarm-table">
        <SectionHeader title="归并告警事件" />
        <table>
          <thead><tr><th>事件ID</th><th>严重级别</th><th>根因设备</th><th>归并数</th><th>首发时间</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {alarms.map((event) => (
              <tr key={event.id} className={selectedId === event.id ? "selected" : ""} onClick={() => setSelectedId(event.id)}>
                <td>{event.id}</td>
                <td><Badge tone={event.severity.toLowerCase()}>{event.severity}</Badge></td>
                <td>{devices.find((device) => device.id === event.rootCauseDeviceId)?.name}</td>
                <td>{event.rawAlarmIds.length}</td>
                <td>{event.createdAt}</td>
                <td>{event.status}</td>
                <td><Link to={`/alarm/${event.id}`}>详情</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="alarm-side">
        <SectionHeader title="事件详情" />
        <AlarmDetail event={selected} />
      </Card>
    </div>
  );
}

export function AlarmDetailPage() {
  const { eventId } = useParams();
  const event = alarms.find((item) => item.id === eventId) ?? alarms[0];
  return (
    <div className="page">
      <div className="page-title"><div><span>告警详情</span><h1>{event.id}</h1></div><Link className="ghost" to="/alarm">返回告警中心</Link></div>
      <Card><AlarmDetail event={event} /></Card>
    </div>
  );
}
