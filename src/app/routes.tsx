import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./layout/AppShell";

const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const TopologyPage = lazy(() => import("../pages/topology/TopologyPage").then((module) => ({ default: module.TopologyPage })));
const AlarmPage = lazy(() => import("../pages/alarm/AlarmPage").then((module) => ({ default: module.AlarmPage })));
const AlarmDetailPage = lazy(() => import("../pages/alarm/AlarmPage").then((module) => ({ default: module.AlarmDetailPage })));
const RootCausePage = lazy(() => import("../pages/rootcause/RootCausePage").then((module) => ({ default: module.RootCausePage })));
const DevicesPage = lazy(() => import("../pages/devices/DevicesPage").then((module) => ({ default: module.DevicesPage })));
const DeviceDetailPage = lazy(() => import("../pages/devices/DevicesPage").then((module) => ({ default: module.DeviceDetailPage })));
const IntegrationPage = lazy(() => import("../pages/integration/IntegrationPage").then((module) => ({ default: module.IntegrationPage })));
const IntegrationNewPage = lazy(() => import("../pages/integration/IntegrationPage").then((module) => ({ default: module.IntegrationNewPage })));
const ManifestPage = lazy(() => import("../pages/manifest/ManifestPage").then((module) => ({ default: module.ManifestPage })));
const CollectionPage = lazy(() => import("../pages/collection/CollectionPage").then((module) => ({ default: module.CollectionPage })));
const MonitoringPage = lazy(() => import("../pages/monitoring/MonitoringPage").then((module) => ({ default: module.MonitoringPage })));
const EdgePage = lazy(() => import("../pages/edge/EdgePage").then((module) => ({ default: module.EdgePage })));
const ReportsPage = lazy(() => import("../pages/reports/ReportsPage").then((module) => ({ default: module.ReportsPage })));
const SettingsPage = lazy(() => import("../pages/settings/SettingsPage").then((module) => ({ default: module.SettingsPage })));

function PageLoader() {
  return (
    <div className="page-loader">
      <span />
      <strong>正在加载模块...</strong>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="topology" element={<TopologyPage />} />
          <Route path="alarm" element={<AlarmPage />} />
          <Route path="alarm/:eventId" element={<AlarmDetailPage />} />
          <Route path="rootcause" element={<RootCausePage />} />
          <Route path="devices" element={<DevicesPage />} />
          <Route path="devices/:deviceId" element={<DeviceDetailPage />} />
          <Route path="integration" element={<IntegrationPage />} />
          <Route path="integration/new" element={<IntegrationNewPage />} />
          <Route path="manifest" element={<ManifestPage />} />
          <Route path="collection" element={<CollectionPage />} />
          <Route path="monitoring" element={<MonitoringPage />} />
          <Route path="edge" element={<EdgePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
