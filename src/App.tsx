import React, { useState } from "react";
import { SuiClientProvider, ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WalletStatus } from "./WalletStatus";
import NFTList from "./NFTList";
import AuditPage from "./AuditPage";
import NetworkSwitcher from "./NetworkSwitcher";

const App: React.FC = () => {
  // Store the current network state.
  const [network, setNetwork] = useState<"testnet" | "mainnet">("testnet");

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
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>dApp Starter Template</Heading>
        </Box>
        <Box>
          <ConnectButton />
        </Box>
      </Flex>

      {/* Main Content */}
      <Container>
        {/* Network switcher component */}
        <NetworkSwitcher currentNetwork={network} setNetwork={setNetwork} />
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          {/* Wallet status and additional components */}
          <WalletStatus />
          <AuditPage />
          <NFTList />
        </Container>
      </Container>

      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={5000} />
    </SuiClientProvider>
  );
};

export default App;
