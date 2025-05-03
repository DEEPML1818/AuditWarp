import React from 'react';
import Layout from './components/Layout';
import WalletStatus from './WalletStatus';
import OwnedObjects from './OwnedObjects';
import AuditPage from './AuditPage';
import { ConnectButton } from '@iota/dapp-kit';

export function App() {
  return (
    <Layout>
      {/* 🔌 Wallet Connect */}
      <div className="flex justify-end mb-6">
        <ConnectButton />
      </div>

      {/* 🧠 Wallet Info + Owned Reports */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass p-4">
          <WalletStatus />
        </div>
        <div className="glass p-4">
          <OwnedObjects />
        </div>
      </div>

      <hr className="my-8 border-cyber-border" />

      {/* 📂 Audit Submission Area */}
      <div className="glass p-6">
        <AuditPage />
      </div>
    </Layout>
  );
}

export default App;
