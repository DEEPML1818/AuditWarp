import  { useState } from 'react';
import { ethers } from 'ethers';
import { wormhole } from '@wormhole-foundation/sdk';
import { PDFDocument } from 'pdf-lib';
import { create } from 'ipfs-http-client';
import ClipLoader from 'react-spinners/ClipLoader';

const CHAIN_ETH = 'Ethereum'; // We're simulating using Ethereum testnet

const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

export default function AuditRequestApp() {
  const [contractCode, setContractCode] = useState('');
  const [userSuiAddress, setUserSuiAddress] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendAuditRequest = async () => {
    if (!contractCode || !userSuiAddress) {
      setStatus('Please provide both contract code and your Sui wallet address.');
      return;
    }

    setStatus('Generating PDF and sending message...');
    setLoading(true);

    try {
      // 1. Generate PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      page.drawText(`Audit Report:\n${contractCode.substring(0, 400)}...`);
      const pdfBytes = await pdfDoc.save();

      // 2. Upload to IPFS
      const result = await ipfs.add(pdfBytes);
      const ipfsUrl = `https://ipfs.io/ipfs/${result.path}`;

      // 3. Send Wormhole message
      const wh = await wormhole('Testnet');
      const ethChain = wh.getChain(CHAIN_ETH);
      const payload = {
        contractCode,
        userAddress: userSuiAddress,
      };

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const message = await ethChain.publishMessage(
        signer,
        JSON.stringify(payload),
        { consistencyLevel: 1 }
      );

      setStatus(`✅ Sent! Tx: ${message.txId}`);
      console.log(`Minting NFT with IPFS URL: ${ipfsUrl} for user: ${userSuiAddress}`);
      setStatus(`NFT minted! View it at IPFS URL: ${ipfsUrl}`);
    } catch (err: any) {
      console.error(err);
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 24 }}>
      <h2>🛰️ Cross-Chain Audit Request (Testnet)</h2>
      <textarea
        rows={6}
        style={{ width: '100%', marginBottom: 8 }}
        placeholder="Paste your smart contract code here..."
        value={contractCode}
        onChange={(e) => setContractCode(e.target.value)}
      />
      <input
        style={{ width: '100%', marginBottom: 16 }}
        placeholder="Your Sui wallet address (for NFT mint)"
        value={userSuiAddress}
        onChange={(e) => setUserSuiAddress(e.target.value)}
      />
      <button onClick={handleSendAuditRequest} disabled={loading}>
        📤 Send Audit Request (to Sui Testnet)
      </button>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <ClipLoader size={50} color="#000" loading={loading} />
        </div>
      )}
      <p style={{ marginTop: 16 }}>{status}</p>
    </div>
  );
}
