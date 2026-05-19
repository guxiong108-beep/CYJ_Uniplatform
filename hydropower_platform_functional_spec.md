# 水电站统一智能管理平台 — Web应用功能规格说明书

> 用途：供 Codex / AI 编码工具直接解析并生成对应 Web 应用代码
> 技术栈：React 18 + TypeScript + Vite · Tailwind CSS · Shadcn/ui · Recharts · React Query · Zustand · React Router v6
> 后端：Node.js + Express · PostgreSQL · Redis · WebSocket(Socket.io)
> AI 服务：调用 LLM API（OpenAI / 本地大模型）

---

## 一、项目结构

```
src/
├── app/                        # 路由与布局
│   ├── layout/
│   │   ├── AppShell.tsx        # 主壳：侧边栏 + 顶栏 + 内容区
│   │   ├── Sidebar.tsx         # 左侧导航
│   │   └── Topbar.tsx          # 顶部栏：告警数、用户、全局搜索
│   └── routes.tsx              # 路由表
├── pages/                      # 页面组件（每个路由对应一个文件夹）
│   ├── dashboard/              # 首页总览
│   ├── topology/               # 全站拓扑
│   ├── alarm/                  # 告警中心
│   ├── rootcause/              # 根因分析
│   ├── devices/                # 设备管理
│   ├── integration/            # 系统接入管理
│   ├── manifest/               # 能力声明管理
│   ├── collection/             # 采集策略管理
│   ├── monitoring/             # 监控意图配置
│   ├── edge/                   # 边缘节点管理
│   ├── reports/                # 报告中心
│   └── settings/               # 系统设置
├── components/                 # 公共组件
│   ├── ui/                     # 基础 UI（来自 shadcn/ui）
│   ├── charts/                 # 图表组件
│   ├── topology/               # 拓扑图组件
│   ├── alarm/                  # 告警组件
│   └── ai/                     # AI 对话、分析面板
├── store/                      # Zustand 状态
├── hooks/                      # 自定义 Hooks
├── services/                   # API 请求层
├── types/                      # TypeScript 类型定义
└── lib/                        # 工具函数
```

---

## 二、路由表

| 路径 | 页面名称 | 说明 |
|------|----------|------|
| `/` | 首页总览 Dashboard | 全站核心指标、实时告警、快捷入口 |
| `/topology` | 全站拓扑图 | 设备拓扑、状态可视化 |
| `/alarm` | 告警中心 | 实时告警列表、归并事件、处置流程 |
| `/alarm/:eventId` | 告警事件详情 | 单个事件的完整因果链 |
| `/rootcause` | 根因分析 | AI 根因推理面板 |
| `/devices` | 设备资产管理 | 设备台账、分类浏览 |
| `/devices/:deviceId` | 设备详情 | 单设备实时状态、历史趋势、关联告警 |
| `/integration` | 系统接入管理 | 已接入系统列表、接入状态、操作 |
| `/integration/new` | 新增接入系统 | 引导式接入向导 |
| `/manifest` | 能力声明管理 | 能力声明上传、解析、字段映射查看 |
| `/collection` | 采集策略管理 | 采集任务列表、策略配置、调度状态 |
| `/monitoring` | 监控意图配置 | 自然语言意图创建、视图绑定 |
| `/edge` | 边缘节点管理 | 边缘节点列表、状态、配置下发 |
| `/reports` | 报告中心 | AI 生成报告、订阅、历史报告 |
| `/settings` | 系统设置 | 用户、权限、通知、平台参数 |

---

## 三、页面功能规格

---

### 3.1 首页总览 `/`

**布局：** 三列自适应网格，顶部状态栏 + 卡片区 + 实时流

#### 顶部状态栏 `<GlobalStatusBar />`
- 显示字段：全站设备总数 / 在线率 / 当前活跃告警数（红色角标）/ 已接入系统数 / 今日采集数据量
- 数据每 30 秒自动刷新（React Query + refetchInterval）
- 告警数大于 0 时状态栏背景出现红色脉冲动效

#### 核心指标卡片区 `<MetricCardGrid />`
- 6 张卡片，每张包含：指标名、当前值、环比趋势箭头、迷你折线图（Recharts Sparkline）
- 指标列表：发电量(MWh)、设备健康指数(%)、告警处置率(%)、采集成功率(%)、边缘节点在线数、根因分析准确率(%)
- 点击卡片跳转到对应详情页

#### 实时告警面板 `<LiveAlarmPanel />`
- 右侧固定宽度面板，展示最近 10 条归并告警
- 每条告警：严重等级色标（红/橙/黄）、设备名、摘要文字、时间
- 顶部"查看全部"按钮跳转 `/alarm`
- 通过 WebSocket 实时推送新告警，新告警出现时列表顶部插入并高亮 3 秒

#### 全站拓扑缩略图 `<TopologyMiniMap />`
- 嵌入简化版拓扑图，仅展示一级节点（变电站/地下厂房/坝面）
- 节点颜色反映健康状态：绿/黄/红
- 点击任意节点跳转 `/topology?focus=nodeId`

#### AI 快速问答入口 `<AskAIWidget />`
- 输入框 + 发送按钮，placeholder："输入问题，例如：上周哪台设备告警最多？"
- 发送后在弹出侧边抽屉中展示 AI 回复（流式输出）
- 抽屉底部提供"生成完整报告"按钮

---

### 3.2 全站拓扑图 `/topology`

**布局：** 左侧图层控制面板（240px） + 中部拓扑画布（自适应）+ 右侧节点详情抽屉（320px，默认收起）

#### 拓扑画布 `<TopologyCanvas />`
- 使用 **React Flow** 渲染设备拓扑图
- 节点类型：
  - `StationNode`：变电站/厂房（矩形卡片，含名称、设备数、健康评分）
  - `DeviceNode`：单台设备（圆角方块，含设备图标、状态灯）
  - `LinkEdge`：连接线（实线=正常，虚线=降级，红线=故障）
- 支持缩放、平移、框选
- 节点点击：打开右侧详情抽屉
- 节点右键菜单：查看详情 / 查看告警 / 定位根因

#### 图层控制面板 `<LayerControl />`
- 多选复选框控制图层显示：电力设备层 / 通信设备层 / 人员定位层 / 视频监控层 / 环境传感器层
- 筛选条件：按健康状态（全部/正常/告警/故障）、按区域（开阔区/封闭区/变电站）
- 搜索框：输入设备名/编号快速定位并居中高亮

#### 节点详情抽屉 `<NodeDetailDrawer />`
- 标签页：基本信息 / 实时数据 / 历史趋势 / 关联告警
- 实时数据以键值对表格展示（字段来自采集策略的必要字段列表）
- 历史趋势使用 Recharts LineChart，支持时间范围选择（1h / 6h / 24h / 7d）
- 底部"查看完整详情"跳转 `/devices/:deviceId`

---

### 3.3 告警中心 `/alarm`

**布局：** 顶部筛选工具栏 + 主体双栏（告警列表左 + 事件详情右）

#### 告警列表 `<AlarmList />`
- 两个标签页切换：**归并事件**（默认） / **原始告警**
- 归并事件列表字段：事件ID / 根因设备 / 严重级别 / 归并告警数 / 首发时间 / 持续时长 / 处置状态 / 操作
- 原始告警列表字段：告警ID / 来源系统 / 设备 / 告警内容 / 级别 / 时间 / 是否已归并
- 列表支持：多列排序、关键字搜索、级别筛选（P1/P2/P3/P4）、时间范围筛选
- 每行左侧有严重级别色条（红/橙/黄/蓝）
- 新告警通过 WebSocket 推入，列表顶部插入并有黄色高亮动效

#### 事件详情面板 `<AlarmEventDetail />`
- 点击归并事件行后右侧展开（不跳页，保持列表可见）
- 展示内容：
  - **事件摘要卡**：根因设备、根因判断、置信度进度条、影响范围
  - **传播链路图** `<PropagationChain />`：横向时间轴 + 节点连线，展示告警传播顺序
  - **处置建议列表**：有序步骤卡片，每步可标记"已执行"
  - **关联原始告警折叠列表**：默认折叠，展开后显示所有归并进来的原始告警
  - **操作按钮**：派单 / 标记处理中 / 关闭事件 / 生成根因报告

#### 顶部工具栏
- 告警统计数字：P1 红色数字 / P2 橙色 / P3 黄色 / 今日新增 / 今日关闭
- 快速筛选标签：全部 / 未处理 / 处理中 / 已关闭
- 右侧：导出 CSV 按钮 / 告警规则配置入口

---

### 3.4 根因分析 `/rootcause`

**布局：** 顶部事件选择器 + 主体三栏（推理过程 | 知识图谱 | 处置建议）

#### 事件选择器 `<EventSelector />`
- 下拉选择当前待分析的告警事件（默认选中最新 P1 事件）
- 支持手动选择历史事件进行复盘

#### AI 推理过程面板 `<ReasoningPanel />`
- 展示 LLM 推理过程，类似 Chain-of-Thought 的步骤卡片流：
  ```
  Step 1 收集相关告警  → [告警列表展开]
  Step 2 关联设备状态  → [状态数据表格]
  Step 3 拓扑路径分析  → [路径高亮]
  Step 4 历史缺陷匹配  → [相似案例卡片]
  Step 5 根因置信度评估 → [置信度雷达图]
  ```
- 每个步骤可展开查看详细数据依据
- 底部展示最终根因结论：设备名、故障类型、置信度（百分比 + 颜色）

#### 知识图谱面板 `<KnowledgeGraphPanel />`
- 使用 D3.js 或 React Flow 渲染故障相关的设备关系子图
- 根因节点高亮（红色加粗边框）
- 受影响节点橙色标注
- 支持展开/折叠相邻节点

#### 处置建议面板 `<RemediationPanel />`
- AI 生成的有序处置步骤
- 每步包含：操作描述、预计耗时、所需角色（继保工程师/运维人员）
- 底部附：历史同类缺陷处置记录（相似度 % + 时间 + 结果）
- "生成处置工单"按钮：自动填充工单模板并导出 PDF

---

### 3.5 设备资产管理 `/devices`

**布局：** 左侧分类树 + 右侧设备列表/卡片视图

#### 设备分类树 `<DeviceCategoryTree />`
- 树形结构：
  ```
  全站设备
  ├── 电力专业设备
  │   ├── 保护装置
  │   ├── 测控单元
  │   └── 故障录波器
  ├── 变电站自动化
  │   ├── RTU
  │   └── 五防系统
  ├── 手持IoT设备
  ├── 人员管理
  ├── 视频监控
  ├── 环境传感器
  └── 施工机械
  ```
- 每个分类节点右侧显示设备数量和告警数（红色角标）

#### 设备列表 `<DeviceTable />`
- 切换按钮：列表视图 / 卡片视图
- 列表视图字段：设备ID / 设备名称 / 类型 / 所属系统 / 区域 / 接入级别(A/B/C/D) / 健康状态 / 最后采集时间 / 操作
- 卡片视图：每张卡片含设备图标、名称、健康状态指示灯、关键指标值（2~3个）
- 批量操作：批量导出 / 批量更新采集策略
- 点击任意设备行/卡片跳转 `/devices/:deviceId`

#### 设备详情页 `/devices/:deviceId`

标签页布局：

**① 基本信息**
- 字段：设备名称、设备编号、型号、厂商、安装位置、接入系统、接入级别、最后在线时间
- 编辑按钮：允许修改备注信息

**② 实时数据**
- 展示当前采集到的必要字段键值对表格
- 字段来源：该设备绑定的采集策略中的必要字段列表
- 数字类字段右侧有小型仪表盘/进度条
- 自动每 5 秒刷新

**③ 历史趋势**
- 多指标折线图（Recharts LineChart），支持多指标勾选叠加
- 时间范围选择器：1h / 6h / 24h / 7d / 自定义
- 支持导出图表为 PNG / 数据为 CSV

**④ 关联告警**
- 该设备历史告警时间轴（垂直时间线组件）
- 每条告警：时间、级别、内容、处置状态
- 可按时间范围筛选

**⑤ 采集策略**
- 展示绑定到该设备的采集策略摘要
- 采集字段列表（必要字段 + 字段来源说明）
- "调整采集策略"按钮跳转到采集策略编辑页

---

### 3.6 系统接入管理 `/integration`

**布局：** 顶部统计栏 + 接入系统卡片网格

#### 接入统计栏 `<IntegrationStats />`
- 数字卡片：总接入系统数 / A级 / B级 / C级 / D级 / 接入异常数

#### 系统卡片网格 `<SystemCardGrid />`
- 每张卡片内容：
  - 系统名称、厂商、版本号
  - 接入级别徽标（A/B/C/D，颜色区分）
  - 连接状态指示灯（在线/离线/异常）
  - 已采集设备数 / 今日采集次数
  - 能力声明状态（已提交/待提交/解析失败）
  - 操作按钮：查看详情 / 查看能力声明 / 重新解析 / 暂停采集
- 卡片顶部色条反映整体健康状态

#### 新增接入向导 `/integration/new`

五步引导式 Wizard：

```
Step 1 基本信息
  - 系统名称（文本输入）
  - 厂商（文本输入）
  - 系统类型（下拉：电力自动化/视频/IoT/人员管理/其他）
  - 接入协议（多选：IEC61850/Modbus/MQTT/OPC-UA/HTTP/私有协议）

Step 2 上传能力声明
  - 拖拽上传 YAML/JSON 文件，或在线编辑器直接编写
  - 实时语法校验，错误行高亮提示
  - 提供能力声明模板下载按钮

Step 3 AI 解析结果确认
  - 展示 LLM 解析后的能力列表（能力名、描述、协议、参数）
  - 每项能力右侧有"确认/排除"开关
  - 展示 AI 推荐的必要采集字段列表，支持人工微调（勾选/取消勾选）
  - AI 置信度评分显示

Step 4 连接测试
  - 输入接入地址（IP/域名）和认证信息（Token/用户名密码/证书）
  - 点击"测试连接"按钮
  - 实时展示测试日志（逐行滚动）
  - 测试成功：绿色✓ + 首次数据采样预览（前5条数据）
  - 测试失败：红色✗ + 错误原因 + AI 诊断建议

Step 5 完成
  - 展示接入摘要（系统名、能力数、采集字段数、采集频率）
  - 选择绑定的边缘节点
  - "立即激活"或"稍后激活"
```

---

### 3.7 能力声明管理 `/manifest`

**布局：** 左侧系统列表 + 右侧能力详情

#### 能力列表面板 `<ManifestList />`
- 列表字段：系统名 / 能力数 / 解析状态 / 最后解析时间 / 操作
- 解析状态：已解析(绿) / 解析中(黄色转圈) / 解析失败(红) / 待提交(灰)
- 操作：重新解析 / 编辑声明 / 导出

#### 能力详情面板 `<ManifestDetail />`
- 展示选中系统的完整能力树：
  ```
  系统：××保护装置管理系统
  ├── 能力：getDeviceStatus
  │   ├── 协议：IEC61850
  │   ├── 参数：deviceId, timeRange
  │   └── 字段映射：operStatus → 运行状态，activePower → 有功功率
  ├── 能力：getAlarmEvents
  │   └── ...
  ```
- 字段映射表格：原始字段名 / 平台统一字段名 / 数据类型 / 单位 / 是否必要采集（开关）
- 底部"AI重新提炼必要字段"按钮：重新调用 LLM 对字段列表进行分析

---

### 3.8 采集策略管理 `/collection`

**布局：** 顶部工具栏 + 采集任务表格

#### 采集任务表格 `<CollectionTaskTable />`
- 字段：任务ID / 目标系统 / 目标能力 / 采集模式 / 采集频率 / 状态 / 上次执行 / 成功率 / 操作
- 采集模式标签：定时轮询(蓝) / 事件订阅(绿) / 流式接收(紫)
- 状态：运行中(绿) / 暂停(灰) / 失败(红)
- 行内快速操作：暂停/启动 切换开关 / 立即执行 / 编辑 / 删除

#### 采集策略编辑抽屉 `<CollectionStrategyDrawer />`
- 滑出式抽屉（从右侧）
- 配置项：
  - 目标系统（下拉）
  - 目标能力（联动下拉，根据系统过滤）
  - 采集字段（多选，来自能力声明字段列表）
  - 采集模式（单选：定时轮询/事件订阅）
  - 轮询间隔（若定时轮询：秒/分钟选择器）
  - 数据保留策略（L1原始层保留天数）
  - 告警触发规则（可选，简单阈值配置）
- 保存后实时生效

#### 采集监控看板 `<CollectionMonitorBoard />`
- 独立标签页
- 实时折线图：过去1小时采集成功率 / 采集延迟分布（P50/P95/P99）
- 失败任务快速排查列表：失败原因 / 最后失败时间 / 一键重试

---

### 3.9 监控意图配置 `/monitoring`

**布局：** 左侧意图列表 + 右侧配置工作区

#### 意图列表 `<IntentList />`
- 每条意图：意图名称 / 创建方式（AI生成/手动） / 关联设备数 / 绑定视图数 / 状态
- "新建意图"按钮

#### 意图创建工作区 `<IntentWorkspace />`

两种创建模式（Tab切换）：

**① 自然语言模式（推荐）**
- 大文本框输入意图描述，placeholder：
  `"例如：监控地下厂房所有旋转设备的振动趋势，振动超过阈值时提前预警"`
- "AI 解析"按钮：调用 LLM，流式输出解析结果：
  ```
  ✓ 识别目标：地下厂房 → 旋转设备（水轮机/发电机/冷却风机）
  ✓ 识别指标：振动加速度、轴承温度
  ✓ 识别条件：振动 > 阈值（建议值：11.2 mm/s，可修改）
  ✓ 识别动作：提前预警（建议：趋势异常提前 30 分钟预测）
  匹配到数据源：××振动监测系统（能力：getVibrationData）
  自动生成采集策略：每 10 秒采集一次
  ```
- 解析完成后展示可编辑的结构化意图卡片（支持微调阈值、时间、设备范围）

**② 结构化配置模式**
- 表单字段：监控目标（设备选择器）/ 监控指标（字段下拉）/ 告警条件（阈值/趋势/异常检测）/ 告警级别 / 通知方式
- 较自然语言模式更精确，适合专业运维人员

**生成视图区**
- 意图配置完成后点击"生成监控视图"
- AI 自动生成对应的仪表盘视图（折线图/仪表盘/状态表格的组合）
- 支持拖拽调整布局
- "发布到大屏"按钮：将视图推送到首页 Dashboard 或独立大屏

---

### 3.10 边缘节点管理 `/edge`

**布局：** 节点卡片网格 + 节点详情侧边栏

#### 节点卡片 `<EdgeNodeCard />`
- 每张卡片：
  - 节点名称（如：地下主厂房边缘节点）
  - 部署位置（区域标签）
  - 在线状态（大号指示灯）
  - 关键指标：CPU占用率 / 内存占用率 / 接入设备数 / 本地缓存使用率
  - 与中心级连接延迟（ms）
  - 是否处于离岛模式（Badge）
- 卡片底部操作：配置下发 / 远程重启 / 查看日志

#### 节点详情侧边栏
- 标签页：实时指标 / 接入设备列表 / 本地告警日志 / 配置信息
- 实时指标：CPU / 内存 / 网络吞吐实时折线图（WebSocket推送，10秒更新）
- 配置下发面板：选择配置模板，点击"下发"后展示下发进度条和结果日志

---

### 3.11 报告中心 `/reports`

**布局：** 左侧报告类型导航 + 右侧报告列表与预览

#### 报告类型
- 日常运营简报（每日自动生成）
- 告警分析报告（周/月）
- 根因分析报告（按事件生成）
- 设备健康评估报告（月度）
- 接入系统状态报告

#### 报告列表 `<ReportList />`
- 字段：报告名称 / 类型 / 生成方式（自动/手动） / 生成时间 / 状态
- 操作：预览 / 下载 PDF / 分享链接 / 删除

#### 报告预览面板 `<ReportPreview />`
- 嵌入式 PDF 预览（iframe 或 react-pdf）
- 右侧"重新生成"按钮：修改时间范围后重新调用 AI 生成

#### 报告订阅配置 `<ReportSubscription />`
- 勾选报告类型 + 设置推送频率（每日/每周/每月）
- 推送方式：邮件 / 系统内消息 / 钉钉/企微 Webhook

---

## 四、公共组件规格

### 4.1 AI 对话侧边抽屉 `<AIChatDrawer />`
- 从右侧滑出，宽度 400px
- 支持多轮对话，消息气泡样式（用户右对齐，AI左对齐）
- AI 回复支持流式输出（Streaming），实时显示生成中的文字
- 回复内容支持渲染：Markdown 文本 / 表格 / 代码块 / 图表（内嵌 Recharts 组件）
- 底部快捷问题推荐（基于当前页面上下文动态生成）
- 全局快捷键 `Ctrl+K` 或 `Cmd+K` 打开

### 4.2 全局搜索 `<GlobalSearch />`
- 顶栏搜索框，点击后展开全屏模糊搜索面板
- 搜索范围：设备名/编号 / 告警内容 / 接入系统 / 报告标题
- 搜索结果分类展示，点击直接跳转
- 支持历史搜索记录

### 4.3 通知中心 `<NotificationCenter />`
- 顶栏铃铛图标，有角标
- 点击下拉：最近 20 条通知，分类：告警 / 系统 / 报告
- "全部已读"按钮
- 通知点击后跳转相关页面并高亮

### 4.4 传播链路组件 `<PropagationChain />`
- SVG 渲染的横向时间轴图
- 节点为圆形（不同颜色区分根因/传播/受影响）
- 连线上标注传播时间差（如 +2.3s）
- 悬停节点展示 Tooltip（设备名、告警内容、时间）

### 4.5 健康评分仪表盘 `<HealthGauge />`
- 半圆仪表盘，0~100 分
- 颜色区间：0-60 红 / 60-80 橙 / 80-100 绿
- 支持 size prop：sm / md / lg

---

## 五、数据模型定义

### Device（设备）
```typescript
interface Device {
  id: string
  name: string
  assetCode: string
  category: DeviceCategory
  vendor: string
  model: string
  location: { zone: 'open' | 'closed' | 'substation'; name: string }
  integrationSystemId: string
  accessLevel: 'A' | 'B' | 'C' | 'D'
  healthScore: number          // 0~100
  status: 'online' | 'offline' | 'fault' | 'warning'
  lastCollectedAt: Date
  collectionStrategyId: string
  keyMetrics: KeyMetric[]      // 当前必要字段快照
}
```

### AlarmEvent（归并告警事件）
```typescript
interface AlarmEvent {
  id: string
  severity: 'P1' | 'P2' | 'P3' | 'P4'
  rootCauseDeviceId: string
  rootCauseDescription: string
  confidence: number           // 0~1
  propagationChain: PropagationNode[]
  impactedDevices: string[]
  impactDescription: string
  remediationSteps: RemediationStep[]
  rawAlarmIds: string[]        // 归并的原始告警ID列表
  status: 'active' | 'processing' | 'closed'
  createdAt: Date
  closedAt?: Date
}
```

### IntegrationSystem（接入系统）
```typescript
interface IntegrationSystem {
  id: string
  name: string
  vendor: string
  version: string
  accessLevel: 'A' | 'B' | 'C' | 'D'
  protocols: Protocol[]
  manifestStatus: 'pending' | 'parsing' | 'parsed' | 'failed'
  manifest?: CapabilityManifest
  connectionStatus: 'online' | 'offline' | 'error'
  edgeNodeId: string
  deviceCount: number
  todayCollectionCount: number
}
```

### CapabilityManifest（能力声明）
```typescript
interface CapabilityManifest {
  systemId: string
  capabilities: Capability[]
  dataKeywords: string[]
  parsedAt: Date
  llmConfidence: number
}

interface Capability {
  name: string
  description: string
  protocol: string
  endpoint: string
  params: string[]
  returnFields: FieldDefinition[]
  requiredFields: string[]     // AI 提炼的必要字段子集
  collectionMode: 'polling' | 'subscription' | 'stream'
}
```

### MonitoringIntent（监控意图）
```typescript
interface MonitoringIntent {
  id: string
  name: string
  naturalLanguageInput?: string
  targetDeviceIds: string[]
  targetFields: string[]
  alertConditions: AlertCondition[]
  generatedViewConfig: ViewConfig  // AI生成的视图配置JSON
  status: 'active' | 'paused' | 'draft'
  createdBy: 'ai' | 'manual'
  createdAt: Date
}
```

---

## 六、API 接口清单

### 设备相关
```
GET    /api/devices                    查询设备列表（支持分页/筛选）
GET    /api/devices/:id                设备详情
GET    /api/devices/:id/metrics        设备实时数据
GET    /api/devices/:id/history        历史趋势数据（?field=&from=&to=）
GET    /api/devices/:id/alarms         设备关联告警
PUT    /api/devices/:id                更新设备信息
```

### 告警相关
```
GET    /api/alarms/events              归并事件列表
GET    /api/alarms/events/:id          事件详情（含传播链）
POST   /api/alarms/events/:id/close    关闭事件
GET    /api/alarms/raw                 原始告警列表
WS     /ws/alarms                      实时告警推送
```

### 根因分析
```
POST   /api/rootcause/analyze          触发根因分析（传入eventId）
GET    /api/rootcause/:eventId         获取分析结果（含reasoning steps）
POST   /api/rootcause/:eventId/report  生成根因分析报告
```

### 接入管理
```
GET    /api/integrations               接入系统列表
POST   /api/integrations               新增接入系统
GET    /api/integrations/:id           系统详情
DELETE /api/integrations/:id           删除接入系统
POST   /api/integrations/:id/test      测试连接
POST   /api/integrations/:id/activate  激活采集
```

### 能力声明
```
GET    /api/manifests/:systemId        获取能力声明
POST   /api/manifests/:systemId        上传/更新能力声明
POST   /api/manifests/:systemId/parse  触发 AI 解析
GET    /api/manifests/:systemId/fields 获取字段映射列表
PUT    /api/manifests/:systemId/fields 更新必要字段选择
```

### 采集策略
```
GET    /api/collection/tasks           任务列表
POST   /api/collection/tasks           新建任务
PUT    /api/collection/tasks/:id       更新任务
DELETE /api/collection/tasks/:id       删除任务
POST   /api/collection/tasks/:id/run   立即执行
GET    /api/collection/stats           采集监控统计数据
```

### 监控意图
```
GET    /api/intents                    意图列表
POST   /api/intents/parse              AI 解析自然语言意图
POST   /api/intents                    保存意图
PUT    /api/intents/:id                更新意图
POST   /api/intents/:id/generate-view  生成视图配置
```

### AI 对话
```
POST   /api/ai/chat                    发送消息（支持流式 SSE 响应）
GET    /api/ai/chat/:sessionId         获取历史对话
POST   /api/ai/reports/generate        生成报告（传入类型和时间范围）
```

### 边缘节点
```
GET    /api/edge/nodes                 节点列表
GET    /api/edge/nodes/:id             节点详情
GET    /api/edge/nodes/:id/metrics     实时资源指标
POST   /api/edge/nodes/:id/config      下发配置
POST   /api/edge/nodes/:id/restart     远程重启
WS     /ws/edge/:id                    实时指标推送
```

---

## 七、状态管理（Zustand Store）

```typescript
// 全局告警状态
interface AlarmStore {
  activeEvents: AlarmEvent[]
  unreadCount: number
  addEvent: (event: AlarmEvent) => void
  markRead: (eventId: string) => void
}

// 全局平台状态
interface PlatformStore {
  globalStats: GlobalStats
  connectedSystems: number
  edgeNodesOnline: number
  isAIChatOpen: boolean
  toggleAIChat: () => void
}

// 当前用户
interface UserStore {
  user: User
  permissions: Permission[]
  hasPermission: (action: string) => boolean
}
```

---

## 八、权限与角色

| 角色 | 可访问页面 | 特殊权限 |
|------|------------|----------|
| 超级管理员 | 全部 | 系统设置、用户管理、删除操作 |
| 运维工程师 | Dashboard/告警/根因/设备/报告 | 告警处置、工单派发 |
| 接入工程师 | 系统接入/能力声明/采集策略 | 新增/修改接入配置 |
| 只读观察员 | Dashboard/拓扑/告警/报告 | 仅查看，无写操作 |

---

## 九、非功能性要求

| 项目 | 要求 |
|------|------|
| 首屏加载 | ≤ 2 秒（生产环境，代码分割+懒加载） |
| 实时数据刷新 | WebSocket 推送，延迟 ≤ 1 秒 |
| 拓扑图性能 | 支持 500+ 节点流畅渲染（React Flow 虚拟化） |
| 响应式 | 支持 1920px 大屏 / 1440px 标准屏 / 1280px 最小兼容宽度 |
| 主题 | 支持深色模式（dark mode），默认深色（适合监控大屏） |
| 国际化 | 预留 i18n 结构，默认中文 |
| 错误边界 | 每个页面级组件包裹 ErrorBoundary，局部错误不影响整体 |

---

## 十、关键交互行为约定

1. **所有列表页** 默认展示 20 条，支持分页，URL 保存当前页和筛选条件（query params）
2. **所有详情页** 顶部有面包屑导航，支持浏览器回退
3. **所有表单** 有未保存变更时，离开前弹出确认 Dialog
4. **告警角标** 在 Sidebar 对应菜单项和顶栏铃铛实时反映未处理告警数
5. **AI 分析操作** 触发后在按钮位置展示 Loading 状态（Spinner + 文字"AI 分析中..."），流式输出时逐字显示
6. **采集状态变化** 通过 Toast 通知（右下角，3秒自动消失）反馈操作结果
7. **WebSocket 断连** 顶栏出现黄色横幅提示"实时数据连接已中断，尝试重连中..."，重连成功后自动消失

---

*本规格说明书为 Codex 生成提示，各页面组件请按上述规格独立生成，路由注册统一在 `src/app/routes.tsx` 中完成。*
