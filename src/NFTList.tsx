import React from "react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import ClipLoader from "react-spinners/ClipLoader";

const NFTList: React.FC = () => {
  const currentAccount = useCurrentAccount();

  // Query for NFTs owned by the current account.
  // Adjust the filter based on your contract's object type.
  const { data, isLoading, error, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: currentAccount?.address ?? "",
      filter: {
        StructType: "0x0d865f8b0ca4c353fbc142af6b74d88c4ec49d28c970b58c48b5599e1d314914::nft::TestnetNFT", // Example filter.
      },
    },
    {
      enabled: !!currentAccount?.address,
    }
  );

  if (isLoading) {
    return (
      <Flex justify="center" align="center" p="4">
        <ClipLoader size={30} />
      </Flex>
    );
  }

  if (error) {
    return (
      <Text color="red" size="2">
        Error loading NFTs: {error.message}
      </Text>
    );
  }

  return (
    <Flex direction="column" gap="2" mt="4">
      <Heading as="h3" size="3">
        Your Minted NFTs
      </Heading>
      {Array.isArray(data) && data.length > 0 ? (
        data.map((nft) => (
          <Flex key={nft.objectId} direction="column" p="2" style={{ border: "1px solid gray" }}>
            <Text>NFT ID: {nft.objectId}</Text>
            {/* Display additional NFT properties if available */}
          </Flex>
        ))
      ) : (
        <Text>No NFTs found.</Text>
      )}
      <Button onClick={() => refetch()}>Refresh</Button>
    </Flex>
  );
};

export default NFTList;
