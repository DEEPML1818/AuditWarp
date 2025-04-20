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

import { PlatformLoader, wormhole } from "@wormhole-foundation/sdk"; // if you want real Wormhole messages

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
        const wh = await wormhole("Testnet", {
            length: 0,
            pop: function (): PlatformLoader<any> | undefined {
                throw new Error("Function not implemented.");
            },
            push: function (): number {
                throw new Error("Function not implemented.");
            },
            concat: function (): PlatformLoader<any>[] {
                throw new Error("Function not implemented.");
            },
            join: function (): string {
                throw new Error("Function not implemented.");
            },
            reverse: function (): PlatformLoader<any>[] {
                throw new Error("Function not implemented.");
            },
            shift: function (): PlatformLoader<any> | undefined {
                throw new Error("Function not implemented.");
            },
            slice: function (_start?: number): PlatformLoader<any>[] {
                throw new Error("Function not implemented.");
            },
            sort: function (): PlatformLoader<any>[] {
                throw new Error("Function not implemented.");
            },
            splice: function (_start: number):[] {
                throw new Error("Function not implemented.");
            },
            unshift: function (): number {
                throw new Error("Function not implemented.");
            },
            indexOf: function (_searchElement: PlatformLoader<any>): number {
                throw new Error("Function not implemented.");
            },
            lastIndexOf: function (_searchElement: PlatformLoader<any>): number {
                throw new Error("Function not implemented.");
            },
            every: function <S extends PlatformLoader<any>>(_predicate: (value: PlatformLoader<any>, index: number, array: PlatformLoader<any>[]) => value is S): this is S[] {
                throw new Error("Function not implemented.");
            },
            some: function (_predicate: (value: PlatformLoader<any>, index: number, array: PlatformLoader<any>[]) => unknown): boolean {
                throw new Error("Function not implemented.");
            },
            forEach: function (_callbackfn: (value: PlatformLoader<any>, index: number, array: PlatformLoader<any>[]) => void): void {
                throw new Error("Function not implemented.");
            },
            map: function <U>(_callbackfn: (value: PlatformLoader<any>, index: number, array: PlatformLoader<any>[]) => U): U[] {
                throw new Error("Function not implemented.");
            },
            filter: function <S extends PlatformLoader<any>>(_predicate: (value: PlatformLoader<any>, index: number, array: PlatformLoader<any>[]) => value is S): S[] {
                throw new Error("Function not implemented.");
            },
            reduce: function (): PlatformLoader<any> {
                throw new Error("Function not implemented.");
            },
            reduceRight: function (): PlatformLoader<any> {
                throw new Error("Function not implemented.");
            },
            find: function <S extends PlatformLoader<any>>(_predicate: (value: PlatformLoader<any>, index: number, obj: PlatformLoader<any>[]) => value is S): S | undefined {
                throw new Error("Function not implemented.");
            },
            findIndex: function (_predicate: (value: PlatformLoader<any>, index: number, obj: PlatformLoader<any>[]) => unknown): number {
                throw new Error("Function not implemented.");
            },
            fill: function (_value: PlatformLoader<any>): PlatformLoader<any>[] {
                throw new Error("Function not implemented.");
            },
            copyWithin: function (_target: number, _start: number): PlatformLoader<any>[] {
                throw new Error("Function not implemented.");
            },
            entries: function (): ArrayIterator<[number, PlatformLoader<any>]> {
                throw new Error("Function not implemented.");
            },
            keys: function (): ArrayIterator<number> {
                throw new Error("Function not implemented.");
            },
            values: function (): ArrayIterator<PlatformLoader<any>> {
                throw new Error("Function not implemented.");
            },
            includes: function (_searchElement: PlatformLoader<any>): boolean {
                throw new Error("Function not implemented.");
            },
            flatMap: function <U, This = undefined>(_callback: (this: This, value: PlatformLoader<any>, index: number, array: PlatformLoader<any>[]) => U | readonly U[]): U[] {
                throw new Error("Function not implemented.");
            },
            flat: function <A, D extends number = 1>(this: A): FlatArray<A, D>[] {
                throw new Error("Function not implemented.");
            },
            [Symbol.iterator]: function (): ArrayIterator<PlatformLoader<any>> {
                throw new Error("Function not implemented.");
            },
            [Symbol.unscopables]: {
                length: false,
                toString: false,
                toLocaleString: false,
                pop: false,
                push: false,
                concat: false,
                join: false,
                reverse: false,
                shift: false,
                slice: false,
                sort: false,
                splice: false,
                unshift: false,
                indexOf: false,
                lastIndexOf: false,
                every: false,
                some: false,
                forEach: false,
                map: false,
                filter: false,
                reduce: false,
                reduceRight: false,
                find: false,
                findIndex: false,
                fill: false,
                copyWithin: false,
                entries: false,
                keys: false,
                values: false,
                includes: false,
                flatMap: false,
                flat: false,
                at: false,
            },
            at: function (): PlatformLoader<any> | undefined {
                throw new Error("Function not implemented.");
            }
        }); // Just pass an empty config for now

        const ethChain = wh.getChain("Ethereum");
        const provider = (window as any).ethereum;
        if (!provider) {
          throw new Error("Ethereum provider not found");
        }
        const signer = await provider.getSigner();
        
        const core = await ethChain.getWormholeCore();

        // Construct the payload
        const payload = JSON.stringify({
        contractCode: codeToAudit,
        userAddress: suiRecipient,
        });

        // Now send the message
        const msg = core.publishMessage(signer, payload, 1, Date.now()); // Passing consistencyLevel directly as a number

        console.log("Wormhole tx:", msg.return);
        setStatusMsg(`✅ Wormhole tx: ${msg.return}`);
        console.log("Wormhole tx:", msg.return);
        setStatusMsg(`✅ Wormhole tx: ${msg.return}`);
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
