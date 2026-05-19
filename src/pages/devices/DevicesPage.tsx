import { Grid2X2, List, Pencil } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { HealthGauge } from "../../components/charts/HealthGauge";
import { Badge, Card, Progress, SectionHeader } from "../../components/ui/Card";
import { alarms, devices, tasks, trendData } from "../../services/mockData";
import { statusLabel } from "../../lib/utils";

const categories = ["全站设备", "电力专业设备", "保护装置", "测控单元", "变电站自动化", "手持IoT设备", "人员管理", "视频监控", "环境传感器", "施工机械"];

export function DevicesPage() {
  const [view, setView] = useState<"table" | "card">("table");
  return (
    <div className="page device-layout">
      <Card className="category-tree">
        <SectionHeader title="设备分类" />
        {categories.map((item, index) => <button key={item} className={index === 0 ? "active" : ""}>{item}<em>{index + 4}</em></button>)}
      </Card>
      <Card className="device-list">
        <SectionHeader title="设备台账" action={<div className="segmented"><button onClick={() => setView("table")}><List size={15} /></button><button onClick={() => setView("card")}><Grid2X2 size={15} /></button></div>} />
        {view === "table" ? (
          <table>
            <thead><tr><th>设备ID</th><th>设备名称</th><th>类型</th><th>区域</th><th>接入级别</th><th>健康</th><th>最后采集</th></tr></thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td>{device.id}</td><td><Link to={`/devices/${device.id}`}>{device.name}</Link></td><td>{device.category}</td><td>{device.location.name}</td>
                  <td><Badge tone="blue">{device.accessLevel}</Badge></td><td><Progress value={device.healthScore} /></td><td>{device.lastCollectedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="device-card-grid">
            {devices.map((device) => (
              <Link to={`/devices/${device.id}`} className="asset-card" key={device.id}>
                <Badge tone={device.status}>{statusLabel(device.status)}</Badge>
                <strong>{device.name}</strong>
                <span>{device.category}</span>
                <Progress value={device.healthScore} />
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export function DeviceDetailPage() {
  const { deviceId } = useParams();
  const device = devices.find((item) => item.id === deviceId) ?? devices[0];
  const relatedAlarms = alarms.filter((alarm) => alarm.rootCauseDeviceId === device.id || alarm.impactedDevices.includes(device.id));

  return (
    <div className="page">
      <div className="page-title">
        <div><span>设备详情 / {device.assetCode}</span><h1>{device.name}</h1></div>
        <button className="ghost icon-text"><Pencil size={16} />编辑备注</button>
      </div>
      <div className="detail-grid">
        <Card><HealthGauge value={device.healthScore} /><div className="detail-list">
          <div><span>型号</span><strong>{device.model}</strong></div><div><span>厂商</span><strong>{device.vendor}</strong></div><div><span>安装位置</span><strong>{device.location.name}</strong></div><div><span>接入级别</span><strong>{device.accessLevel}</strong></div>
        </div></Card>
        <Card>
          <SectionHeader title="实时必要字段" />
          {device.keyMetrics.map((metric) => <div className="kv-row" key={metric.label}><span>{metric.label}</span><strong>{metric.value}{metric.unit}</strong></div>)}
        </Card>
        <Card className="span-2">
          <SectionHeader title="历史趋势" />
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <Tooltip contentStyle={{ background: "#111927", border: "1px solid #26364c" }} />
              <Line dataKey="health" stroke="#2adf9f" name="健康指数" dot={false} />
              <Line dataKey="vibration" stroke="#ffc857" name="振动" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionHeader title="关联告警" />
          {relatedAlarms.length ? relatedAlarms.map((alarm) => <Link to={`/alarm/${alarm.id}`} className="timeline-item" key={alarm.id}><Badge tone={alarm.severity.toLowerCase()}>{alarm.severity}</Badge>{alarm.rootCauseDescription}</Link>) : <p>暂无关联告警。</p>}
        </Card>
        <Card>
          <SectionHeader title="采集策略" />
          <p>{tasks.find((task) => task.id === device.collectionStrategyId)?.capability ?? "默认策略"} · 每10秒采集必要字段。</p>
          <Link to="/collection" className="primary full">调整采集策略</Link>
        </Card>
      </div>
    </div>
  );
}
