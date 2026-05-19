# 水电站统一智能管理平台

基于 `hydropower_platform_functional_spec.md` 生成的 React/Vite 前端原型。当前实现覆盖首页总览、全站拓扑、告警中心、根因分析、设备资产、系统接入、能力声明、采集策略、监控意图、边缘节点、报告中心和系统设置。

## 运行

```powershell
npm install
npm run dev
```

如果 PowerShell 执行策略拦截 `npm.ps1`，可以使用：

```powershell
npm.cmd install
npm.cmd run dev
```

默认访问地址：

```text
http://localhost:5173
```

## 构建

```powershell
npm run build
```

## 代码组织

- `src/app`：路由、布局和应用壳
- `src/pages`：业务页面模块，按规格中的路由拆分
- `src/components`：公共 UI、图表、告警、AI 组件
- `src/services`：模拟数据与后续 API 接入层
- `src/store`：Zustand 全局状态
- `src/types`：平台核心类型定义
- `src/lib`：通用工具函数

路由已使用 `React.lazy` 做页面级代码分割，后续接入真实后端时优先替换 `src/services/mockData.ts`。
