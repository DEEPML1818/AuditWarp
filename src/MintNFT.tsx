// MintNFT.tsx
import { useState, ChangeEvent } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

interface NFTData {
  name: string;
  description: string;
  url: string;
}

export function MintNFT() {
  // Hard-coded package ID (replace if needed), or retrieve via useNetworkVariable
  const nftPackageId =
    "0x0d865f8b0ca4c353fbc142af6b74d88c4ec49d28c970b58c48b5599e1d314914";
  const suiClient = useSuiClient();
  // currentAccount not used here but can be obtained with useCurrentAccount()
  // const currentAccount = useCurrentAccount();

  // Configure signAndExecute with the Sui client.
  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showEffects: true,
        },
      }),
  });

  // State for NFT data, loading, transaction response, and error.
  const [nftData, setNFTData] = useState<NFTData>({ name: "", description: "", url: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [txResponse, setTxResponse] = useState<any>(null);
  const [error, setError] = useState<string>("");

  // Update input fields.
  function handleChange(field: keyof NFTData) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setNFTData({ ...nftData, [field]: e.target.value });
    };
  }

  // Build and submit the transaction.
  function mint() {
    if (!nftPackageId) {
      toast.error("NFT package ID not detected. Please check your network configuration.");
      setLoading(false);
      return;
    }

    const tx = new Transaction();

    // Build the move call.
    // Pass your string arguments directly to tx.pure (no TextEncoder() needed).
    tx.moveCall({
      target: `${nftPackageId}::nft::mint_to_sender`,
      arguments: [
        tx.pure.string((nftData.name)),
        tx.pure.string((nftData.description)),
        tx.pure.string((nftData.url)),
      ],
     
    });

    // Submit the transaction.
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => {
          setTxResponse(result);
          toast.success("NFT minted successfully!");
          setLoading(false);
        },
        onError: (err: any) => {
          const msg = err.message || "Minting failed";
          setError(msg);
          toast.error(msg);
          setLoading(false);
        },
      }
    );
  }

  return (
    <Container>
      <Heading>Mint NFT</Heading>
      <Flex direction="column" gap="3" mt="4">
        <input placeholder="NFT Name" value={nftData.name} onChange={handleChange("name")} />
        <input
          placeholder="NFT Description"
          value={nftData.description}
          onChange={handleChange("description")}
        />
        <input placeholder="NFT URL" value={nftData.url} onChange={handleChange("url")} />
        <Button onClick={mint} disabled={loading}>
          {loading ? <ClipLoader size={20} /> : "Mint NFT"}
        </Button>
        {txResponse && (
          <Text size="2">
            Transaction Response:
            <pre>{JSON.stringify(txResponse, null, 2)}</pre>
          </Text>
        )}
        {error && (
          <Text color="red" size="2">
            Error: {error}
          </Text>
        )}
      </Flex>
    </Container>
  );
}

export default MintNFT;
