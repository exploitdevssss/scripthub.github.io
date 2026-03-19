import { useMemo, useState } from 'react';
import { generateLua } from '../lib/lua-generator';
import { HubConfig } from '../lib/types';
import { Copy, Check, FileCode2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function CodePanel({ config }: { config: HubConfig }) {
  const code = useMemo(() => generateLua(config), [config]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
     <div className="w-96 bg-card border-l border-border flex flex-col h-full z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.3)]">
        <div className="p-5 border-b border-border flex flex-col gap-4 bg-card/50 backdrop-blur-sm">
           <div className="flex items-center gap-2 text-foreground">
              <FileCode2 className="text-primary" size={20} />
              <h2 className="font-display font-bold text-lg tracking-wide">Compiled Lua</h2>
           </div>
           <button 
              onClick={handleCopy} 
              className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-sm ${
                copied 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] active:scale-[0.98]'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied to Clipboard!" : "Copy Full Script"}
           </button>
        </div>
        
        <div className="flex-1 p-4 overflow-hidden bg-background/50">
           <div className="h-full w-full relative rounded-xl overflow-hidden border border-border/80 bg-[#0d0d12]">
             {/* Line numbers fake gutter */}
             <div className="absolute top-0 bottom-0 left-0 w-8 bg-[#15151c] border-r border-border/50 z-0 pointer-events-none" />
             
             <textarea 
               value={code}
               readOnly
               spellCheck="false"
               className="absolute inset-0 w-full h-full bg-transparent p-4 pl-10 text-[11.5px] leading-relaxed font-mono text-[#a5a5c0] focus:outline-none resize-none custom-scrollbar z-10 selection:bg-primary/30"
             />
             
             {/* Subtle gradient overlay to make it look nicer */}
             <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] z-20" />
           </div>
        </div>
        
        <div className="p-3 border-t border-border bg-card/50 text-center">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
             Ready for Synapse X / KRNL / Script-Ware
           </p>
        </div>
     </div>
  )
}
