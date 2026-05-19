export type Severity = "P1" | "P2" | "P3" | "P4";
export type Status = "online" | "offline" | "fault" | "warning";
export type AccessLevel = "A" | "B" | "C" | "D";

export interface KeyMetric {
  label: string;
  value: string;
  unit?: string;
}

export interface Device {
  id: string;
  name: string;
  assetCode: string;
  category: string;
  vendor: string;
  model: string;
  location: { zone: "open" | "closed" | "substation"; name: string };
  integrationSystemId: string;
  accessLevel: AccessLevel;
  healthScore: number;
  status: Status;
  lastCollectedAt: string;
  collectionStrategyId: string;
  keyMetrics: KeyMetric[];
}

export interface PropagationNode {
  id: string;
  deviceName: string;
  type: "root" | "spread" | "impact";
  alarm: string;
  time: string;
  delta: string;
}

export interface RemediationStep {
  id: string;
  action: string;
  duration: string;
  role: string;
  done?: boolean;
}

export interface AlarmEvent {
  id: string;
  severity: Severity;
  rootCauseDeviceId: string;
  rootCauseDescription: string;
  confidence: number;
  propagationChain: PropagationNode[];
  impactedDevices: string[];
  impactDescription: string;
  remediationSteps: RemediationStep[];
  rawAlarmIds: string[];
  status: "active" | "processing" | "closed";
  createdAt: string;
}

export interface IntegrationSystem {
  id: string;
  name: string;
  vendor: string;
  version: string;
  accessLevel: AccessLevel;
  protocols: string[];
  manifestStatus: "pending" | "parsing" | "parsed" | "failed";
  connectionStatus: "online" | "offline" | "error";
  edgeNodeId: string;
  deviceCount: number;
  todayCollectionCount: number;
}

export interface CollectionTask {
  id: string;
  system: string;
  capability: string;
  mode: "定时轮询" | "事件订阅" | "流式接收";
  frequency: string;
  status: "运行中" | "暂停" | "失败";
  lastRun: string;
  successRate: number;
}

export interface EdgeNode {
  id: string;
  name: string;
  location: string;
  online: boolean;
  cpu: number;
  memory: number;
  devices: number;
  cache: number;
  latency: number;
  island: boolean;
}
