// src/App.jsx
import React, { useState } from "react";
import { SuiClientProvider, ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, Button } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { WalletStatus } from "./WalletStatus";
import AuditPage from "./AuditPage";
import NFTList from "./NFTList";
import WormholePage from "./wormhole";    // Your single‑file wormhole UI
import NetworkSwitcher from "./NetworkSwitcher";

const App: React.FC = () => {
  const [network, setNetwork] = useState<"testnet" | "mainnet">("testnet");
  const [page, setPage] = useState<"home" | "audit">("home");

  return (
    <SuiClientProvider
      networks={{
        testnet: { url: "https://fullnode.testnet.sui.io" },
        mainnet: { url: "https://fullnode.mainnet.sui.io" },
      }}
      defaultNetwork={network}
    >
      {/* Header with Tabs */}
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        align="center"
        style={{ borderBottom: "1px solid var(--gray-a2)" }}
      >
        <Box>
          <Heading>AuditWarp</Heading>
        </Box>

        <Flex gap="2" align="center">
          <Button
            variant={page === "home" ? "solid" : "soft"}
            onClick={() => setPage("home")}
          >
            Home
          </Button>
          <Button
            variant={page === "audit" ? "solid" : "soft"}
            onClick={() => setPage("audit")}
          >
            Audit
          </Button>
          <ConnectButton />
        </Flex>
      </Flex>

      {/* Main Content */}
      <Container>
        <NetworkSwitcher currentNetwork={network} setNetwork={setNetwork} />
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          {page === "home" ? (
            <>
              <WalletStatus />
              <AuditPage />
              <NFTList />
            </>
          ) : (
            <WormholePage />
          )}
        </Container>
      </Container>

      <ToastContainer position="top-right" autoClose={5000} />
    </SuiClientProvider>
  );
};

export default App;
