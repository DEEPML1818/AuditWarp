// src/wormhole.tsx
import React, { useState } from "react";
import { SuiClientProvider } from "@mysten/dapp-kit";
import {
  Box,
  Container,
  Flex,
  Heading,
  TextArea,
  Button,
} from "@radix-ui/themes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PDFDocument } from "pdf-lib";
import { create } from "ipfs-http-client";
import { ethers } from "ethers";
import { wormhole } from "@wormhole-foundation/sdk"; // if you want real Wormhole messages

// Initialize IPFS client
const ipfs = create({ url: "https://ipfs.infura.io:5001/api/v0" });

const WormholePage: React.FC = () => {
  // Sui network toggle
  const [network, setNetwork] = useState<"testnet" | "mainnet">("testnet");
  // Which view
  const [showWormholeUI, setShowWormholeUI] = useState(false);
  console.log(setNetwork)
  // MetaMask state
  const [ethAccount, setEthAccount] = useState<string | null>(null);

  // Audit flow state
  const [codeToAudit, setCodeToAudit] = useState("");
  const [suiRecipient, setSuiRecipient] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [reportLink, setReportLink] = useState("");

  // Connect/disconnect MetaMask
  const connectWallet = async () => {
    if (!(window as any).ethereum) {
      toast.error("MetaMask not detected");
      return;
    }
    try {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      setEthAccount(accounts[0]);
      toast.success(`MetaMask connected: ${accounts[0].slice(0,6)}…${accounts[0].slice(-4)}`);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to connect MetaMask");
    }
  };
  const disconnectWallet = () => {
    setEthAccount(null);
    toast.info("MetaMask disconnected");
  };

  // Main audit + IPFS (and optional Wormhole) flow
  const handleWormholeAudit = async () => {
    if (!codeToAudit || !suiRecipient) {
      toast.error("Enter both contract code and your Sui address");
      return;
    }

    try {
      setStatusMsg("⏳ Generating audit PDF…");

      // 1. Create PDF
      const pdf = await PDFDocument.create();
      const page = pdf.addPage([600, 400]);
      page.drawText(`Audit Report\n\n${codeToAudit.substring(0, 300)}...`);
      const pdfBytes = await pdf.save();

      // 2. Upload to IPFS
      setStatusMsg("⏳ Uploading to IPFS…");
      const res = await ipfs.add(pdfBytes);
      const url = `https://ipfs.io/ipfs/${res.path}`;
      setReportLink(url);

      // 3. (Optional) Publish a Wormhole message
      if (ethAccount) {
        setStatusMsg("📡 Sending Wormhole message…");
        const wh = await wormhole("Testnet");
        const ethChain = wh.getChain("Ethereum");
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const payload = JSON.stringify({
          contractCode: codeToAudit,
          userAddress: suiRecipient,
        });
        const msg = await ethChain.publishMessage(signer, payload, {
          consistencyLevel: 1,
        });
        console.log("Wormhole tx:", msg.txId);
        setStatusMsg(`✅ Wormhole tx: ${msg.txId}`);
      } else {
        setStatusMsg("⚠️ MetaMask not connected — skipping Wormhole");
      }

      toast.success("✅ Audit complete! See link below.");
    } catch (e: any) {
      console.error(e);
      setStatusMsg("❌ Something went wrong");
      toast.error("Processing error");
    }
  };

  return (
    <SuiClientProvider
      networks={{
        testnet: { url: "https://fullnode.testnet.sui.io" },
        mainnet: { url: "https://fullnode.mainnet.sui.io" },
      }}
      defaultNetwork={network}
    >
      {/* Header */}
      <Flex
        px="4"
        py="2"
        justify="between"
        style={{ borderBottom: "1px solid var(--gray-a2)" }}
      >
        <Box>
          <Heading>Wormhole Audit dApp MVP</Heading>
        </Box>
        <Flex gap="3" align="center">
          <Button
            variant={showWormholeUI ? "soft" : "solid"}
            onClick={() => setShowWormholeUI(false)}
          >
            Dashboard
          </Button>
          <Button
            variant={!showWormholeUI ? "soft" : "solid"}
            onClick={() => setShowWormholeUI(true)}
          >
            Wormhole Audit
          </Button>

          {ethAccount ? (
            <Button variant="soft" onClick={disconnectWallet}>
              Disconnect {ethAccount.slice(0,6)}…{ethAccount.slice(-4)}
            </Button>
          ) : (
            <Button variant="solid" onClick={connectWallet}>
              Connect MetaMask
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Main */}
      <Container py="4" style={{ minHeight: 500 }}>
        {showWormholeUI ? (
          <>
            <Heading size="4" mb="3">
              🛰️ Wormhole Audit
            </Heading>
            <TextArea
              size="3"
              placeholder="Paste your smart contract code here"
              value={codeToAudit}
              onChange={(e) => setCodeToAudit(e.target.value)}
              style={{ width: "100%", marginBottom: 12 }}
            />
            <input
              type="text"
              placeholder="Your Sui wallet address"
              value={suiRecipient}
              onChange={(e) => setSuiRecipient(e.target.value)}
              style={{
                marginBottom: 12,
                padding: "8px",
                width: "100%",
                border: "1px solid var(--gray-a2)",
                borderRadius: 4,
              }}
            />
            <Button onClick={handleWormholeAudit}>🚀 Submit Audit</Button>

            {statusMsg && <p style={{ marginTop: 16 }}>{statusMsg}</p>}
            {reportLink && (
              <p>
                📄 Report:{" "}
                <a href={reportLink} target="_blank" rel="noreferrer">
                  {reportLink}
                </a>
              </p>
            )}
          </>
        ) : (
          <>
            <Heading size="4" mb="3">
              📊 Dashboard
            </Heading>
            <p>Your minted audit NFTs and stats will appear here.</p>
          </>
        )}
      </Container>

      <ToastContainer position="top-right" autoClose={4000} />
    </SuiClientProvider>
  );
};

export default WormholePage;
