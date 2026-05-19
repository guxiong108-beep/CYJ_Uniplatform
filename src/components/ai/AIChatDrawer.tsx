import { Send, X } from "lucide-react";
import { useState } from "react";
import { usePlatformStore } from "../../store/usePlatformStore";

export function AIChatDrawer() {
  const { isAIChatOpen, closeAIChat } = usePlatformStore();
  const [messages, setMessages] = useState([
    { role: "ai", text: "我已接入全站设备、告警、采集策略与边缘节点上下文。可以直接问我根因、趋势、报告或接入方案。" }
  ]);
  const [input, setInput] = useState("");

  if (!isAIChatOpen) return null;

  const send = () => {
    if (!input.trim()) return;
    setMessages((items) => [
      ...items,
      { role: "user", text: input },
      { role: "ai", text: `已分析：${input}。当前最值得关注的是 P1 事件 EVT-20260518-001，根因置信度 91%，建议优先核查断路器操作回路。` }
    ]);
    setInput("");
  };

  return (
    <aside className="ai-drawer">
      <div className="drawer-head">
        <div>
          <strong>AI 运维助手</strong>
          <span>流式分析 · 报告生成 · 处置建议</span>
        </div>
        <button className="icon-btn" onClick={closeAIChat} aria-label="关闭 AI 助手"><X size={18} /></button>
      </div>
      <div className="chat-list">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>{message.text}</div>
        ))}
      </div>
      <div className="quick-prompts">
        {["生成今日运营简报", "解释当前P1根因", "哪些设备健康下降最快"].map((item) => (
          <button key={item} onClick={() => setInput(item)}>{item}</button>
        ))}
      </div>
      <div className="chat-input">
        <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder="输入问题，例如：上周哪台设备告警最多？" />
        <button className="primary icon-text" onClick={send}><Send size={16} />发送</button>
      </div>
    </aside>
  );
}
