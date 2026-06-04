import React, { useState, useEffect } from "react";
import { Box, Flex, Stack, Grid } from "./StitchPrimitives";

export default function BiometricDecryptor({ onDecryptSuccess }: { onDecryptSuccess: () => void }) {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [passcode, setPasscode] = useState<string>("");
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLR", "0", "ENT"];

  const bootSequence = [
    "SYSTEM_BOOT: INITIALIZING KERNEL 2.6.0...",
    "NET_HANDSHAKE: ENCRYPTED STITCH SECURE CHANNELS ACTIVE...",
    "CORE_STORAGE: SUPABASE REALTIME PROTOCOLS LISTENING...",
    "> ENTER_PASSKEY_TO_DECRYPT_VAULT: _"
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < bootSequence.length) {
        setTerminalLogs(prev => [...prev, bootSequence[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (key: string) => {
    if (key === "CLR") setPasscode("");
    else if (key === "ENT") {
      if (passcode === "1337" || passcode === "8888") {
        setTerminalLogs(prev => [...prev, "> ACCESS GRANTED. DECRYPTING PARTITIONS..."]);
        setTimeout(onDecryptSuccess, 800);
      } else {
        setTerminalLogs(prev => [...prev, "> ACCESS DENIED. INVALID MATRIX."]);
        setPasscode("");
      }
    } else {
      if (passcode.length < 4) setPasscode(prev => prev + key);
    }
  };

  return (
    <Box className="w-full h-screen bg-[#000000] border-none rounded-none flex items-center justify-center p-12 select-none">
      <Flex gap="gap-12" className="w-full max-w-[1400px] h-[700px] bg-transparent border-none">
        {/* Left Panel: Terminal */}
        <Box className="flex-1 h-full p-10 font-mono text-[#00F0FF] text-sm overflow-hidden flex flex-col justify-end shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#00F0FF]/30 to-transparent"></div>
          <Stack gap="gap-4">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className={log?.includes("DENIED") ? "text-red-500 font-bold" : "tracking-wider"}>{log}</div>
            ))}
            <div className="text-white tracking-[0.5em] h-6 mt-4 opacity-80 animate-pulse">
              {passcode.padEnd(4, '_')}
            </div>
          </Stack>
        </Box>

        {/* Right Panel: Keypad */}
        <Box className="w-[500px] h-full p-12 flex flex-col items-center justify-center relative shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#00E676]/30 to-transparent"></div>
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="text-xs font-mono text-slate-500 tracking-[0.3em] uppercase mb-4">Operator Authorization</span>
            <div className="flex gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`w-4 h-4 rounded-full border transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${passcode.length > i ? 'bg-[#00F0FF] border-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.6)]' : 'bg-black border-[#1F2226]'}`}></div>
              ))}
            </div>
          </div>

          <Grid cols="grid-cols-3" gap="gap-8">
            {keys.map((k) => (
              <button
                key={k}
                onClick={() => handleKeyPress(k)}
                className="w-[72px] h-[72px] min-w-[48px] min-h-[48px] rounded-full border border-[#1F2226] bg-[#000000] text-[#00F0FF] font-mono text-xl font-bold flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#00F0FF] hover:bg-[#00F0FF]/5 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-[0.95] cursor-pointer"
              >
                {k}
              </button>
            ))}
          </Grid>
        </Box>
      </Flex>
    </Box>
  );
}
