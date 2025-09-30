import { Bot, Sparkles } from "lucide-react";

export function AiInsightsCard() {
  return (
    <div className="walz-gradient-insights rounded-xl p-6 text-white relative overflow-hidden">
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="px-3 py-1 bg-green-400/90 text-green-900 rounded-full text-xs font-semibold">
              +7.1% this month
            </div>
          </div>
          <h3 className="text-xl font-bold leading-tight">
            Great financial progress!
          </h3>
          <p className="text-blue-100 text-sm leading-relaxed max-w-xl">
            Your spending decreased by 15% this month and you're building
            healthy habits. You're on track to reach your emergency fund goal 2
            months early!
          </p>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium text-sm mt-4 transition-all border border-white/30">
            View Full Analysis →
          </button>
        </div>
      </div>
      <div className="absolute -right-6 -bottom-6 opacity-20">
        <div className="w-40 h-40 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Bot className="w-20 h-20 text-white" />
        </div>
      </div>
    </div>
  );
}
