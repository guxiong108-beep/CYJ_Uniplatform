import type { AlarmEvent, CollectionTask, Device, EdgeNode, IntegrationSystem } from "../types";

export const devices: Device[] = [
  {
    id: "CB-T2-35K",
    name: "#2主变35kV侧断路器",
    assetCode: "HD-SUB-CB-035-02",
    category: "电力专业设备 / 断路器",
    vendor: "华东继保",
    model: "HDB-35K",
    location: { zone: "substation", name: "35kV变电站" },
    integrationSystemId: "sys-protect",
    accessLevel: "A",
    healthScore: 58,
    status: "fault",
    lastCollectedAt: "2026-05-18 19:31:12",
    collectionStrategyId: "COL-001",
    keyMetrics: [
      { label: "操作电流", value: "0.42", unit: "A" },
      { label: "分合闸次数", value: "1284" },
      { label: "回路状态", value: "异常" }
    ]
  },
  {
    id: "GEN-U1",
    name: "1号水轮发电机组",
    assetCode: "HD-UG-GEN-001",
    category: "电力专业设备 / 发电机",
    vendor: "东方电机",
    model: "SF320-48",
    location: { zone: "closed", name: "地下主厂房" },
    integrationSystemId: "sys-vibration",
    accessLevel: "A",
    healthScore: 87,
    status: "online",
    lastCollectedAt: "2026-05-18 19:35:04",
    collectionStrategyId: "COL-002",
    keyMetrics: [
      { label: "有功功率", value: "287", unit: "MW" },
      { label: "轴承温度", value: "62", unit: "℃" },
      { label: "振动", value: "6.8", unit: "mm/s" }
    ]
  },
  {
    id: "ENV-DAM-04",
    name: "坝肩渗压监测点04",
    assetCode: "HD-DAM-ENV-004",
    category: "环境传感器 / 渗压计",
    vendor: "川仪",
    model: "SY-200",
    location: { zone: "open", name: "右岸坝肩" },
    integrationSystemId: "sys-env",
    accessLevel: "B",
    healthScore: 78,
    status: "warning",
    lastCollectedAt: "2026-05-18 19:34:44",
    collectionStrategyId: "COL-003",
    keyMetrics: [
      { label: "渗压", value: "0.38", unit: "MPa" },
      { label: "水位", value: "612.4", unit: "m" }
    ]
  },
  {
    id: "CAM-UG-12",
    name: "地下厂房AI摄像机12",
    assetCode: "HD-UG-CAM-012",
    category: "视频监控 / AI摄像",
    vendor: "海康",
    model: "AI-4K",
    location: { zone: "closed", name: "地下厂房安装间" },
    integrationSystemId: "sys-video",
    accessLevel: "B",
    healthScore: 92,
    status: "online",
    lastCollectedAt: "2026-05-18 19:34:58",
    collectionStrategyId: "COL-004",
    keyMetrics: [
      { label: "在线帧率", value: "25", unit: "fps" },
      { label: "识别事件", value: "3" }
    ]
  }
];

export const alarms: AlarmEvent[] = [
  {
    id: "EVT-20260518-001",
    severity: "P1",
    rootCauseDeviceId: "CB-T2-35K",
    rootCauseDescription: "断路器操作回路断线，触发保护跳闸失败与越级动作",
    confidence: 0.91,
    propagationChain: [
      { id: "n1", deviceName: "#2主变35kV侧断路器", type: "root", alarm: "操作回路断线", time: "19:12:17", delta: "0s" },
      { id: "n2", deviceName: "差动保护装置", type: "spread", alarm: "保护跳闸失败", time: "19:12:19", delta: "+2.1s" },
      { id: "n3", deviceName: "35kV I段母线", type: "spread", alarm: "母线失压", time: "19:12:21", delta: "+4.5s" },
      { id: "n4", deviceName: "3台馈线开关", type: "impact", alarm: "连锁跳闸", time: "19:12:23", delta: "+6.2s" }
    ],
    impactedDevices: ["GEN-U1", "ENV-DAM-04"],
    impactDescription: "影响35kV I段母线，负荷约12.3MW，地下厂房局部控制链路降级。",
    remediationSteps: [
      { id: "s1", action: "现场检查端子排 X3:7 接线与辅助触点状态", duration: "15分钟", role: "继保工程师" },
      { id: "s2", action: "隔离故障回路并切换备用跳闸回路", duration: "10分钟", role: "运维人员" },
      { id: "s3", action: "完成保护联跳试验后恢复运行", duration: "20分钟", role: "继保工程师" }
    ],
    rawAlarmIds: ["RAW-9011", "RAW-9012", "RAW-9017", "RAW-9020"],
    status: "active",
    createdAt: "2026-05-18 19:12:17"
  },
  {
    id: "EVT-20260518-002",
    severity: "P2",
    rootCauseDeviceId: "ENV-DAM-04",
    rootCauseDescription: "渗压趋势连续偏高，疑似排水廊道局部堵塞",
    confidence: 0.78,
    propagationChain: [
      { id: "n1", deviceName: "坝肩渗压监测点04", type: "root", alarm: "渗压越限", time: "18:48:06", delta: "0s" },
      { id: "n2", deviceName: "坝肩排水廊道", type: "impact", alarm: "排水量下降", time: "18:51:22", delta: "+3m16s" }
    ],
    impactedDevices: ["ENV-DAM-04"],
    impactDescription: "坝肩局部监测区进入关注状态，建议巡检复核。",
    remediationSteps: [
      { id: "s1", action: "复核渗压计零漂与通讯质量", duration: "8分钟", role: "巡检人员" },
      { id: "s2", action: "检查排水孔通畅情况", duration: "30分钟", role: "土建运维" }
    ],
    rawAlarmIds: ["RAW-8901", "RAW-8904"],
    status: "processing",
    createdAt: "2026-05-18 18:48:06"
  }
];

export const integrations: IntegrationSystem[] = [
  { id: "sys-protect", name: "继电保护装置管理系统", vendor: "华东继保", version: "2.3.1", accessLevel: "A", protocols: ["IEC61850", "IEC104"], manifestStatus: "parsed", connectionStatus: "online", edgeNodeId: "edge-ug", deviceCount: 42, todayCollectionCount: 182400 },
  { id: "sys-vibration", name: "旋转设备振动监测系统", vendor: "东方电机", version: "5.1.0", accessLevel: "A", protocols: ["OPC-UA", "MQTT"], manifestStatus: "parsed", connectionStatus: "online", edgeNodeId: "edge-ug", deviceCount: 18, todayCollectionCount: 96400 },
  { id: "sys-video", name: "AI视频分析平台", vendor: "海康", version: "8.0", accessLevel: "B", protocols: ["GB/T 28181", "HTTP"], manifestStatus: "parsing", connectionStatus: "online", edgeNodeId: "edge-dam", deviceCount: 96, todayCollectionCount: 42110 },
  { id: "sys-env", name: "大坝安全监测系统", vendor: "川仪", version: "3.4.2", accessLevel: "B", protocols: ["Modbus", "NB-IoT"], manifestStatus: "parsed", connectionStatus: "error", edgeNodeId: "edge-dam", deviceCount: 136, todayCollectionCount: 38752 }
];

export const tasks: CollectionTask[] = [
  { id: "COL-001", system: "继电保护装置管理系统", capability: "getAlarmEvents", mode: "事件订阅", frequency: "实时", status: "运行中", lastRun: "19:35:11", successRate: 99.4 },
  { id: "COL-002", system: "旋转设备振动监测系统", capability: "getVibrationData", mode: "定时轮询", frequency: "10秒", status: "运行中", lastRun: "19:35:10", successRate: 98.7 },
  { id: "COL-003", system: "大坝安全监测系统", capability: "getSeepageData", mode: "定时轮询", frequency: "60秒", status: "失败", lastRun: "19:31:04", successRate: 91.2 },
  { id: "COL-004", system: "AI视频分析平台", capability: "streamVisionEvents", mode: "流式接收", frequency: "实时", status: "暂停", lastRun: "18:59:20", successRate: 96.1 }
];

export const edgeNodes: EdgeNode[] = [
  { id: "edge-ug", name: "地下主厂房边缘节点", location: "地下厂房", online: true, cpu: 43, memory: 62, devices: 88, cache: 34, latency: 12, island: false },
  { id: "edge-dam", name: "坝面安全监测边缘节点", location: "坝面/库区", online: true, cpu: 56, memory: 71, devices: 156, cache: 48, latency: 18, island: false },
  { id: "edge-sub", name: "变电站保护边缘节点", location: "35kV变电站", online: true, cpu: 39, memory: 58, devices: 64, cache: 29, latency: 9, island: false },
  { id: "edge-site", name: "施工区移动接入节点", location: "施工区", online: false, cpu: 0, memory: 0, devices: 24, cache: 82, latency: 0, island: true }
];

export const trendData = Array.from({ length: 24 }, (_, index) => ({
  time: `${index}:00`,
  health: 84 + Math.sin(index / 2) * 8,
  success: 96 + Math.cos(index / 3) * 2,
  vibration: 6 + Math.sin(index / 1.7) * 1.4,
  latency: 20 + Math.cos(index / 2.2) * 8
}));
