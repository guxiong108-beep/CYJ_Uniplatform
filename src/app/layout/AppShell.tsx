import { Outlet } from "react-router-dom";
import { AIChatDrawer } from "../../components/ai/AIChatDrawer";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-column">
        <Topbar />
        <main className="page-wrap">
          <Outlet />
        </main>
      </div>
      <AIChatDrawer />
    </div>
  );
}
