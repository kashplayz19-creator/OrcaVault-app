import React, { useState, useEffect } from 'react';
import BiometricDecryptor from './components/BiometricDecryptor';
import LoadingDashboardPage from './components/LoadingDashboardPage';
import ErrorAPIFailurePage from './components/ErrorAPIFailurePage';
import Global404Page from './components/Global404Page';
import OfflineStatusPage from './components/OfflineStatusPage';
import EmptyStateWorkspace from './components/EmptyStateWorkspace';
import CommandShell from './components/CommandShell';

export default function App() {
  const [systemState, setSystemState] = useState<"DECRYPT" | "LOADING" | "ERROR" | "NOT_FOUND" | "OFFLINE" | "EMPTY" | "ACTIVE">("DECRYPT");

  useEffect(() => {
    if (systemState === "LOADING") {
      const timer = setTimeout(() => {
        setSystemState("ACTIVE");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [systemState]);

  return (
    <>
      {systemState === "DECRYPT" && (
        <BiometricDecryptor onDecryptSuccess={() => setSystemState("LOADING")} />
      )}
      {systemState === "LOADING" && <LoadingDashboardPage />}
      {systemState === "ERROR" && <ErrorAPIFailurePage onRetry={() => setSystemState("LOADING")} />}
      {systemState === "NOT_FOUND" && <Global404Page onBack={() => setSystemState("ACTIVE")} />}
      {systemState === "OFFLINE" && <OfflineStatusPage onReconnect={() => setSystemState("LOADING")} />}
      {systemState === "EMPTY" && <EmptyStateWorkspace onInit={() => setSystemState("ACTIVE")} />}
      {systemState === "ACTIVE" && <CommandShell onReEncrypt={() => setSystemState("DECRYPT")} />}
    </>
  );
}

