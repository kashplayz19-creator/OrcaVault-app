import React, { useState } from "react";
import { Shield, Eye, EyeOff, Lock } from "lucide-react";

export default function BiometricDecryptor({ onDecryptSuccess }: { onDecryptSuccess: () => void }) {
  const [passcode, setPasscode] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [systemMsg, setSystemMsg] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "1337" || passcode === "8888") {
      setSystemMsg("Access granted. Decrypting asset partitions...");
      setErrorMsg("");
      setTimeout(onDecryptSuccess, 800);
    } else {
      setErrorMsg("Access denied. Invalid authentication token.");
      setPasscode("");
    }
  };

  return (
    <div className="w-full h-screen bg-[#09090b] flex items-center justify-center p-6 select-none font-sans">
      <div className="bg-[#0c0d0e] border border-zinc-800/80 rounded-2xl p-8 max-w-md w-full shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          
          {/* Premium low-profile status icon */}
          <div className="w-12 h-12 bg-zinc-900/80 border border-zinc-800/80 rounded-xl flex items-center justify-center mb-5 text-[#00F0FF]/80">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>

          <h2 className="font-sans text-xl font-semibold text-zinc-100 tracking-tight text-center">
            Nexus Vault Authentication
          </h2>
          <p className="font-sans text-xs text-zinc-400 text-center mt-1.5 mb-6">
            Enter your credential token to decrypt and access your private asset workspace.
          </p>

          <div className="w-full space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Secure credential code..."
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg font-sans text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all pr-12"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <p className="text-red-400 font-sans text-[11px] text-center font-medium animate-pulse">
                {errorMsg}
              </p>
            )}

            {systemMsg && (
              <p className="text-[#00E676] font-sans text-[11px] text-center font-medium">
                {systemMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 active:scale-[0.99] text-zinc-900 font-sans text-sm font-medium rounded-lg transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none cursor-pointer"
            >
              Authorize Workspace
            </button>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-900/60 w-full flex items-center justify-center gap-1.5 text-zinc-600 font-mono text-[9px] tracking-wider uppercase">
            <Lock className="w-3 h-3 text-zinc-700 animate-pulse" />
            SECURED AUTHENTICATION GATEWAY
          </div>
        </form>
      </div>
    </div>
  );
}
