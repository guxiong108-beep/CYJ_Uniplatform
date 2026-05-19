import { Badge, Card, SectionHeader } from "../../components/ui/Card";

export function SettingsPage() {
  return (
    <div className="page">
      <div className="page-title"><div><span>系统设置</span><h1>用户、权限、通知与平台参数</h1></div></div>
      <div className="settings-grid">
        <Card><SectionHeader title="角色权限" /><table><tbody>{["超级管理员", "运维工程师", "接入工程师", "只读观察员"].map((role) => <tr key={role}><td>{role}</td><td><Badge tone="blue">已启用</Badge></td></tr>)}</tbody></table></Card>
        <Card><SectionHeader title="通知策略" /><label className="check-row"><input type="checkbox" defaultChecked />P1/P2 告警推送到系统内消息</label><label className="check-row"><input type="checkbox" defaultChecked />每日自动生成运营简报</label><label className="check-row"><input type="checkbox" />Webhook 推送到企微</label></Card>
        <Card><SectionHeader title="平台参数" /><div className="form-grid"><label>实时重连间隔<input defaultValue="5秒" /></label><label>原始数据保留<input defaultValue="30天" /></label><label>AI置信度阈值<input defaultValue="0.75" /></label><label>默认主题<select><option>深色模式</option></select></label></div></Card>
      </div>
    </div>
  );
}
