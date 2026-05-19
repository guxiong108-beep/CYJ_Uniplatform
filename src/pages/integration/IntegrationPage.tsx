import { CheckCircle2, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Card, Progress, SectionHeader } from "../../components/ui/Card";
import { integrations } from "../../services/mockData";

export function IntegrationPage() {
  return (
    <div className="page">
      <div className="page-title">
        <div><span>系统接入管理</span><h1>能力声明式接入与自动适配</h1></div>
        <Link to="/integration/new" className="primary">新增接入系统</Link>
      </div>
      <div className="stat-strip">
        {["总接入", "A级", "B级", "C级", "D级", "接入异常"].map((item, index) => <Card key={item}><span>{item}</span><strong>{index === 0 ? integrations.length : index === 1 ? 2 : index === 2 ? 2 : index === 5 ? 1 : 0}</strong></Card>)}
      </div>
      <div className="card-grid-4">
        {integrations.map((system) => (
          <Card key={system.id} className={`system-card ${system.connectionStatus}`}>
            <Badge tone="blue">{system.accessLevel}级</Badge>
            <h2>{system.name}</h2>
            <p>{system.vendor} · v{system.version}</p>
            <div className="kv-row"><span>连接状态</span><strong>{system.connectionStatus}</strong></div>
            <div className="kv-row"><span>采集设备</span><strong>{system.deviceCount} 台</strong></div>
            <div className="kv-row"><span>今日采集</span><strong>{system.todayCollectionCount.toLocaleString()} 次</strong></div>
            <Progress value={system.connectionStatus === "error" ? 42 : 94} />
            <div className="button-row"><button className="ghost">查看详情</button><Link to="/manifest" className="ghost">能力声明</Link></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function IntegrationNewPage() {
  const steps = ["基本信息", "上传能力声明", "AI解析确认", "连接测试", "完成激活"];
  return (
    <div className="page">
      <div className="page-title"><div><span>新增接入系统</span><h1>五步引导式接入向导</h1></div></div>
      <Card className="wizard">
        <div className="wizard-steps">{steps.map((step, index) => <div className={index <= 2 ? "done" : ""} key={step}>{index < 2 ? <CheckCircle2 size={16} /> : index + 1}<span>{step}</span></div>)}</div>
        <div className="wizard-body">
          <div className="form-grid">
            <label>系统名称<input placeholder="例如：旋转设备振动监测系统" /></label>
            <label>厂商<input placeholder="设备或系统厂商" /></label>
            <label>系统类型<select><option>电力自动化</option><option>视频/IoT</option><option>人员管理</option></select></label>
            <label>接入协议<select><option>IEC61850 / OPC-UA / MQTT</option></select></label>
          </div>
          <div className="upload-box"><UploadCloud size={30} /><strong>拖拽上传 YAML/JSON 能力声明</strong><span>或使用在线编辑器编写，AI 将提炼必要字段与采集策略。</span></div>
          <button className="primary">AI 解析并进入下一步</button>
        </div>
      </Card>
    </div>
  );
}
