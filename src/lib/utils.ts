import type { Severity, Status } from "../types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function severityClass(severity: Severity) {
  return {
    P1: "danger",
    P2: "orange",
    P3: "yellow",
    P4: "blue"
  }[severity];
}

export function statusLabel(status: Status) {
  return {
    online: "在线",
    offline: "离线",
    fault: "故障",
    warning: "告警"
  }[status];
}

export const sparkline = [82, 85, 81, 89, 92, 90, 96, 94, 98, 101, 99, 105].map((value, index) => ({
  name: `${index + 1}`,
  value
}));
