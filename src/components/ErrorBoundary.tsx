import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050608] text-white flex flex-col items-center justify-center p-6 font-mono">
          <div className="max-w-md w-full bg-[#0c0d0e] border border-red-500/30 rounded-2xl p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-7 h-7 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-sans font-bold text-zinc-100 tracking-tight">
                Runtime State Exception
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                The terminal session encountered an unexpected state error while parsing live telemetry. The white-screen guard intercepted the crash gracefully.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#050608] border border-zinc-800 rounded-lg p-3 text-left overflow-x-auto">
                <p className="text-[10px] text-red-400 font-mono break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/30 rounded-xl font-sans font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <RefreshCw className="w-4 h-4" />
              Re-Initialize Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
