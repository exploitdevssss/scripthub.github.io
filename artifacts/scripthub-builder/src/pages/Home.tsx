import { useHubBuilder } from "@/hooks/use-hub-builder";
import { Sidebar } from "@/components/Sidebar";
import { PreviewPanel } from "@/components/PreviewPanel";
import { CodePanel } from "@/components/CodePanel";
import { AiPanel } from "@/components/AiPanel";

export default function Home() {
  const builder = useHubBuilder();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground selection:bg-primary/30">
      <Sidebar builder={builder} />
      <PreviewPanel config={builder.config} />
      <CodePanel config={builder.config} />
      <AiPanel config={builder.config} onApply={builder.applyConfig} />
    </div>
  );
}
