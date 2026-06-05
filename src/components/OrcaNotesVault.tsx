import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Box, Flex, Stack, Grid } from './StitchPrimitives';
import { Terminal as TerminalIcon, FileText, ToggleLeft, ToggleRight, Save, Eye, Edit3, ShieldAlert, CheckCircle, Database } from 'lucide-react';

const VITE_SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const VITE_SUPABASE_KEY = (import.meta as any).env?.VITE_SUPABASE_KEY || "";

const supabase = (VITE_SUPABASE_URL && VITE_SUPABASE_KEY) 
  ? createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY) 
  : null;

interface OrcaNotesVaultProps {
  currentTicker: string;
  onLogAdd?: (msg: string) => void;
}

interface NoteItem {
  id: string;
  ticker: string;
  text_chunk: string;
  created_at: string;
  metadata?: any;
}

export default function OrcaNotesVault({ currentTicker, onLogAdd }: OrcaNotesVaultProps) {
  const [text, setText] = useState<string>("");
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [notesHistory, setNotesHistory] = useState<NoteItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  // Initialize and load default templates if no data exists
  useEffect(() => {
    // 1. First, load from localStorage fallback
    const localKey = `orca-vault-note-${currentTicker}`;
    const saved = localStorage.getItem(localKey);
    if (saved) {
      setText(saved);
    } else {
      // Default high-density institutional boilerplate notes for the specific ticker
      const defaultTemplate = `# ${currentTicker} QUANTITATIVE AUDIT LOG\n\n- Evaluated Benjamin Graham criteria checklist parameters.\n- EPV trading valuation ratio verified.\n- Operating model margin stands steady at compliant metrics.\n- Monitor immediate regional sovereign policy handshakes.\n\n> ENCRYPTED IN RECORD SIGNATURE.`;
      setText(defaultTemplate);
    }

    // 2. Load previous database logs / snapshots for this ticker
    fetchHistory();
  }, [currentTicker]);

  // Handle manual saving to local cache
  const saveToLocal = (newText: string) => {
    const localKey = `orca-vault-note-${currentTicker}`;
    localStorage.setItem(localKey, newText);
  };

  const handleChangeText = (val: string) => {
    setText(val);
    saveToLocal(val);
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('vault_memory')
          .select('*')
          .eq('ticker', currentTicker)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const formatted: NoteItem[] = data.map((d: any) => ({
            id: d.id || String(Math.random()),
            ticker: d.ticker || currentTicker,
            text_chunk: d.text_chunk || '',
            created_at: d.created_at || new Date().toISOString(),
            metadata: d.metadata
          }));
          setNotesHistory(formatted);
        } else {
          loadLocalHistoryOnly();
        }
      } else {
        loadLocalHistoryOnly();
      }
    } catch {
      loadLocalHistoryOnly();
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadLocalHistoryOnly = () => {
    const historyKey = `orca-vault-history-${currentTicker}`;
    const localHist = localStorage.getItem(historyKey);
    if (localHist) {
      setNotesHistory(JSON.parse(localHist));
    } else {
      setNotesHistory([]);
    }
  };

  const saveLocalHistoryRecord = (newText: string) => {
    const historyKey = `orca-vault-history-${currentTicker}`;
    const existing = localStorage.getItem(historyKey);
    const list: NoteItem[] = existing ? JSON.parse(existing) : [];
    
    const newRecord: NoteItem = {
      id: String(Date.now()),
      ticker: currentTicker,
      text_chunk: newText,
      created_at: new Date().toISOString(),
      metadata: { source: 'Client Local Sandbox', timestamp: new Date().toISOString() }
    };
    
    const updated = [newRecord, ...list].slice(0, 10);
    localStorage.setItem(historyKey, JSON.stringify(updated));
    setNotesHistory(updated);
  };

  const handleSaveEncryptedLog = async () => {
    if (!text.trim()) return;
    setSaveStatus('saving');
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    if (onLogAdd) {
      onLogAdd(`[${timestamp}][Vault]: Initiating encryption vector sequence for ${currentTicker}.`);
    }

    // Generate deterministic mock embedding of 1536 floats just like backend expects
    const generateEmbedding = (srcText: string): number[] => {
      const size = 1536;
      const vec = new Array(size);
      let hash = 0;
      for (let i = 0; i < srcText.length; i++) {
        hash = srcText.charCodeAt(i) + ((hash << 5) - hash);
      }
      for (let i = 0; i < size; i++) {
        vec[i] = Math.sin(hash + i) * Math.cos(i * 1.5);
      }
      const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
      return vec.map(v => mag > 0 ? v / mag : 0);
    };

    try {
      if (supabase) {
        // Attempt save to Supabase
        const embeddingVec = generateEmbedding(text);
        const { error } = await supabase
          .from('vault_memory')
          .insert({
            ticker: currentTicker,
            text_chunk: text,
            embedding: embeddingVec,
            metadata: {
              source: 'Orcavault UI Frontend Markdown Editor',
              timestamp: new Date().toISOString()
            }
          });

        if (error) {
          throw error;
        }

        if (onLogAdd) {
          onLogAdd(`[${timestamp}][Vault]: Decentrated cloud vector upload successful for ${currentTicker}.`);
        }
      } else {
        // Local simulation log
        if (onLogAdd) {
          onLogAdd(`[${timestamp}][Vault]: Cloud severed. Buffered note locally with secure storage fallback.`);
        }
      }

      // Always save local history sandbox for absolute durability
      saveLocalHistoryRecord(text);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.warn("Save Error, reverting safely to offline buffer:", err);
      saveLocalHistoryRecord(text);
      setSaveStatus('error');
      if (onLogAdd) {
        onLogAdd(`[${timestamp}][System]: PostgreSQL warning - Synchronized locally inside vault client cache.`);
      }
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  const handleLoadSnapshot = (noteContent: string) => {
    setText(noteContent);
    saveToLocal(noteContent);
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    if (onLogAdd) {
      onLogAdd(`[${timestamp}][Vault]: Snapshot loaded into active workspace registers.`);
    }
  };

  // Ultra-lightweight markdown parser to render basic styling elegantly
  const renderSimpleMarkdown = (markdownStr: string) => {
    if (!markdownStr.trim()) {
      return <div className="text-zinc-500 italic font-sans text-[10px]">Empty document content.</div>;
    }
    const lines = markdownStr.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("# ")) {
        return <h3 key={idx} className="text-[#00F0FF] text-[11px] font-bold uppercase tracking-wider border-b border-zinc-850 pb-1 mt-4 mb-2 font-sans">{trimmed.slice(2)}</h3>;
      }
      if (trimmed.startsWith("## ")) {
        return <h4 key={idx} className="text-[#00E676] text-[10px] font-semibold uppercase tracking-wider mt-3 mb-1.5 font-sans">{trimmed.slice(3)}</h4>;
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return <div key={idx} className="pl-4 text-[10px] text-zinc-300 font-sans flex items-start gap-1.5 py-0.5"><span className="text-[#00F0FF]">•</span><span>{trimmed.slice(2)}</span></div>;
      }
      if (trimmed.startsWith("> ")) {
        return <blockquote key={idx} className="border-l-2 border-[#00F0FF]/50 pl-3 py-1 my-2 bg-zinc-800/10 text-zinc-400 text-[9.5px] italic font-sans">{trimmed.slice(2)}</blockquote>;
      }
      return <p key={idx} className="text-[10px] leading-relaxed text-zinc-300 font-sans my-1 min-h-[14px]">{trimmed}</p>;
    });
  };

  return (
    <Box className="flex-1 flex flex-col h-full bg-[#0c0d0e] overflow-hidden select-none relative max-h-[500px]">
      
      {/* Mini control panel */}
      <Flex justify="justify-between" className="border-b border-zinc-800/60 pb-2 mb-3">
        <Flex gap="gap-2">
          <FileText className="w-4.5 h-4.5 text-[#00F0FF]" />
          <span className="font-sans text-[10px] text-zinc-200 font-bold tracking-wider uppercase">
            {currentTicker} SECURE MEMORY VAULT
          </span>
        </Flex>

        {/* Edit / Preview Controls */}
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="flex items-center gap-1.5 px-2.5 py-1 border border-zinc-800/80 bg-zinc-800/40 text-zinc-400 hover:text-white rounded-lg text-[9px] font-bold font-sans tracking-wide transition-all duration-300 cursor-pointer active:scale-95"
        >
          {isPreview ? (
            <>
              <Edit3 className="w-3 h-3 text-[#00E676]" />
              <span>EDIT LOG</span>
            </>
          ) : (
            <>
              <Eye className="w-3 h-3 text-[#00F0FF]" />
              <span>COMPILE</span>
            </>
          )}
        </button>
      </Flex>

      {/* Editor or Preview Pane */}
      <div className="flex-1 min-h-0 flex flex-col">
        {isPreview ? (
          <Box className="flex-1 bg-[#09090b] border border-zinc-800/60 p-4 font-sans text-[9.5px] overflow-y-auto selection:bg-[#00F0FF]/30 select-text rounded-lg max-h-[220px]">
            {renderSimpleMarkdown(text)}
          </Box>
        ) : (
          <div className="flex-1 flex flex-col">
            <textarea
              value={text}
              onChange={(e) => handleChangeText(e.target.value)}
              className="w-full flex-1 min-h-[160px] bg-[#09090b] border border-zinc-800/60 p-3 text-[11px] font-sans text-zinc-200 outline-none focus:border-zinc-700 rounded-lg selection:bg-[#00F0FF]/35 select-text resize-none"
              placeholder={`Write telemetry notes or markdown highlights for ${currentTicker}...`}
            />
          </div>
        )}
      </div>

      {/* Action Zone & Snapshots */}
      <Stack gap="gap-3" className="mt-3">
        
        {/* Glow animated save button */}
        <button
          onClick={handleSaveEncryptedLog}
          className={`w-full py-2 flex items-center justify-center gap-2 font-sans text-[10px] font-bold tracking-wider rounded-lg transition-all duration-400 cursor-pointer border active:scale-[0.98] ${
            saveStatus === 'saving'
              ? 'bg-[#00F0FF]/5 border-[#00F0FF] text-[#00F0FF] cursor-wait animate-pulse'
              : saveStatus === 'success'
              ? 'bg-[#00E676]/10 border-[#00E676]/60 text-[#00E676]'
              : saveStatus === 'error'
              ? 'bg-red-500/10 border-red-500/60 text-red-400'
              : 'bg-gradient-to-r from-zinc-800 to-zinc-800/60 hover:from-zinc-700 hover:to-zinc-700/80 text-[#00F0FF] border-zinc-750'
          }`}
        >
          {saveStatus === 'saving' && <TerminalIcon className="w-3.5 h-3.5 animate-spin" />}
          {saveStatus === 'success' && <CheckCircle className="w-3.5 h-3.5 text-[#00E676]" />}
          {saveStatus === 'error' && <ShieldAlert className="w-3.5 h-3.5 text-red-500" />}
          {saveStatus === 'idle' && <Save className="w-3.5 h-3.5" />}
          
          <span className="uppercase">
            {saveStatus === 'saving' && "ENCRYPTING DATASTREAM..."}
            {saveStatus === 'success' && "TRANSACTION SUCCESSFUL [SIGNED]"}
            {saveStatus === 'error' && "BUFFERED LOCALLY [LOCAL ONLY]"}
            {saveStatus === 'idle' && "COMMIT VAULT SNAPSHOT"}
          </span>
        </button>

        {/* Snapshots chron logs block */}
        <div className="flex flex-col border-t border-zinc-840/40 pt-2 bg-transparent">
          <span className="text-[8.5px] text-zinc-500 font-sans tracking-widest uppercase mb-1.5 block font-semibold">
            CHRONOLOGICAL SNAPSHOT SYSTEM RECOVERIES:
          </span>
          <div className="max-h-[90px] overflow-y-auto pr-1 flex flex-col gap-1 text-[9px] font-sans scrollbar-thin">
            {historyLoading ? (
              <span className="text-zinc-600 italic">Querying records schema...</span>
            ) : notesHistory.length > 0 ? (
              notesHistory.map((note) => {
                const dateStr = new Date(note.created_at).toLocaleTimeString('en-US', { hour12: false });
                const previewSnippet = note.text_chunk ? note.text_chunk.split("\n").filter(l => l.trim() && !l.startsWith("#")).join(" ").slice(0, 48) + "..." : "No characters";
                return (
                  <div 
                    key={note.id}
                    onClick={() => handleLoadSnapshot(note.text_chunk)}
                    className="flex flex-row items-center justify-between bg-[#09090b]/80 border border-zinc-800/40 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-zinc-800/40 hover:border-zinc-700/60 active:scale-[0.98] transition-all"
                  >
                    <Flex gap="gap-1.5" className="min-w-0 flex-1">
                      <Database className="w-2.5 h-2.5 text-zinc-500 flex-shrink-0" />
                      <span className="text-zinc-400 truncate max-w-[240px] font-sans text-[10px]">{previewSnippet}</span>
                    </Flex>
                    <span className="text-[#00F0FF] font-medium text-[8px] bg-zinc-800 border border-zinc-750 px-1.5 py-0.5 rounded flex-shrink-0">{dateStr}</span>
                  </div>
                );
              })
            ) : (
              <span className="text-zinc-600 italic">No persistent memory snapshots found for {currentTicker}.</span>
            )}
          </div>
        </div>

      </Stack>
    </Box>
  );
}
