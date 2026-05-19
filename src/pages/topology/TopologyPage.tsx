import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { HealthGauge } from "../../components/charts/HealthGauge";
import { Badge, Card, SectionHeader } from "../../components/ui/Card";
import { devices } from "../../services/mockData";
import { statusLabel } from "../../lib/utils";

const layers = ["电力设备层", "通信设备层", "人员定位层", "视频监控层", "环境传感器层"];

export function TopologyPage() {
  const [selected, setSelected] = useState(devices[0]);

  return (
    <div className="page topology-layout">
      <Card className="layer-panel">
        <SectionHeader title="图层控制" />
        {layers.map((layer) => (
          <label className="check-row" key={layer}><input type="checkbox" defaultChecked />{layer}</label>
        ))}
        <div className="filter-block">
          <span>健康状态</span>
          <select><option>全部</option><option>正常</option><option>告警</option><option>故障</option></select>
        </div>
        <div className="filter-block">
          <span>设备定位</span>
          <div className="inline-search"><Search size={15} /><input placeholder="设备名/编号" /></div>
        </div>
      </Card>

      <Card className="topology-canvas">
        <SectionHeader title="全站设备拓扑" />
        <div className="topology-board">
          <div className="station-node center-node">中心级平台<span>全局分析 · 数据湖</span></div>
          {devices.map((device, index) => (
            <button key={device.id} className={`device-node node-${index} ${device.status}`} onClick={() => setSelected(device)}>
              <strong>{device.name}</strong>
              <span>{device.category}</span>
            </button>
          ))}
          <svg className="topology-lines">
            <line x1="50%" y1="24%" x2="20%" y2="52%" />
            <line x1="50%" y1="24%" x2="42%" y2="70%" />
            <line x1="50%" y1="24%" x2="70%" y2="48%" />
            <line x1="50%" y1="24%" x2="78%" y2="76%" />
          </svg>
        </div>
      </Card>

      <Card className="detail-drawer">
        <SectionHeader title="节点详情" />
        <HealthGauge value={selected.healthScore} />
        <div className="detail-list">
          <div><span>设备名称</span><strong>{selected.name}</strong></div>
          <div><span>资产编号</span><strong>{selected.assetCode}</strong></div>
          <div><span>所属区域</span><strong>{selected.location.name}</strong></div>
          <div><span>状态</span><Badge tone={selected.status}>{statusLabel(selected.status)}</Badge></div>
        </div>
        <h3>实时数据</h3>
        {selected.keyMetrics.map((metric) => <div className="kv-row" key={metric.label}><span>{metric.label}</span><strong>{metric.value}{metric.unit}</strong></div>)}
        <Link className="primary full" to={`/devices/${selected.id}`}>查看完整详情</Link>
      </Card>
    </div>
  );
}
