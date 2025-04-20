import React, { useState } from "react";
import { SuiClientProvider } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, TextArea, Button } from "@radix-ui/themes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PDFDocument } from "pdf-lib";
import { create } from "ipfs-http-client";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";


// Initialize IPFS client
const ipfs = create({ url: "https://ipfs.infura.io:5001/api/v0" });

// Initialize the injected connector for MetaMask
const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });
console.log(injected);

const WormholePage: React.FC = () => {
  const { connector, account, active: isActive } = useWeb3React();

  const [network, setNetwork] = useState<"testnet" | "mainnet">("testnet");
  const [showWormholeUI, setShowWormholeUI] = useState(false);
  console.log(setNetwork)
  const [codeToAudit, setCodeToAudit] = useState("");
  const [suiRecipient, setSuiRecipient] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [reportLink, setReportLink] = useState("");

  const connectWallet = async () => {
    try {
      await injected.activate();
      toast.success("Wallet connected!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect wallet");
    }
  };

  const disconnectWallet = () => {
    if (connector && connector.deactivate) {
      connector.deactivate();
    }
    toast.info("Wallet disconnected");
  };

  const handleWormholeAudit = async () => {
    if (!codeToAudit || !suiRecipient) {
      toast.error("Enter both contract code and your Sui address");
      return;
    }

    try {
      setStatusMsg("⏳ Generating audit PDF and uploading...");
      // 1. Create PDF
      const pdf = await PDFDocument.create();
      const page = pdf.addPage([600, 400]);
      page.drawText(`Audit Report\n\n${codeToAudit.substring(0, 300)}...`);
      const pdfBytes = await pdf.save();

      // 2. Upload to IPFS
      const res = await ipfs.add(pdfBytes);
      const url = `https://ipfs.io/ipfs/${res.path}`;
      setReportLink(url);

      // 3. Simulate Wormhole message & NFT mint
      setStatusMsg("📡 Sent to Sui chain via Wormhole!");
      toast.success("Audit request sent & NFT minted!");
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
      <Flex px="4" py="2" justify="between" style={{ borderBottom: "1px solid var(--gray-a2)" }}>
        <Box>
          <Heading>Wormhole Audit dApp MVP</Heading>
        </Box>
        <Flex gap="3">
          <Button variant={showWormholeUI ? "soft" : "solid"} onClick={() => setShowWormholeUI(false)}>
            Dashboard
          </Button>
          <Button variant={!showWormholeUI ? "soft" : "solid"} onClick={() => setShowWormholeUI(true)}>
            Wormhole Audit
          </Button>
          {isActive ? (
            <Button variant="soft" onClick={disconnectWallet}>
              Disconnect ({account?.substring(0, 6)}...{account?.substring(account.length - 4)})
            </Button>
          ) : (
            <Button variant="solid" onClick={connectWallet}>
              Connect Wallet
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Main */}
      <Container py="4" style={{ minHeight: 500 }}>
        {showWormholeUI ? (
          <>
            <Heading size="4" mb="3">🛰️ Wormhole Audit</Heading>
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
                borderRadius: "4px",
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
            <Heading size="4" mb="3">📊 Dashboard</Heading>
            <p>Your minted audit NFTs and stats will appear here.</p>
          </>
        )}
      </Container>

      <ToastContainer position="top-right" autoClose={4000} />
    </SuiClientProvider>
  );
};

export default WormholePage;