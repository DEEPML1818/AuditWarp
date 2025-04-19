import React from "react";
import { Flex, Button, Text } from "@radix-ui/themes";

interface NetworkSwitcherProps {
  currentNetwork: "testnet" | "mainnet";
  setNetwork: (network: "testnet" | "mainnet") => void;
}

const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({
  currentNetwork,
  setNetwork,
}) => {
  return (
    <Flex gap="2" align="center" justify="center" mt="4">
      <Text>Current Network: {currentNetwork}</Text>
      <Button onClick={() => setNetwork("testnet")}>Testnet</Button>
      <Button onClick={() => setNetwork("mainnet")}>Mainnet</Button>
    </Flex>
  );
};

export default NetworkSwitcher;