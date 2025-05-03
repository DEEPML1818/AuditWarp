import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@iota/dapp-kit';
import OwnedObjects from './OwnedObjects';
import { networkConfig } from './networkConfig';
import { Container, Flex, Heading, Text } from '@radix-ui/themes';

type AddressInfo = {
  balance: string;
};

export default function WalletStatus() {
  const account = useCurrentAccount();
  const envAddress = import.meta.env.VITE_IOTA_ADDRESS || '';
  const [balance, setBalance] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (account) return;

    if (!envAddress) {
      setError('No IOTA address configured (VITE_IOTA_ADDRESS)');
      return;
    }

    async function fetchBalance() {
      try {
        const res = await fetch(
          `${networkConfig.devnet.jsonRpcUrl}/api/core/v2/addresses/${envAddress}`
        );
        if (!res.ok) throw new Error(`Node responded ${res.status}`);
        const data = (await res.json()) as AddressInfo;
        setBalance(data.balance);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch balance');
      }
    }

    fetchBalance();
  }, [account, envAddress]);

  return (
    <Container className="text-cyber-base space-y-4">
      <Heading size="2" className="text-cyber-electric">Wallet Status</Heading>

      {account ? (
        <Flex direction="column" className="space-y-1 mt-2">
          <Text className="text-cyber-lime">Connected</Text>
          <Text className="text-sm break-all">{account.address}</Text>
        </Flex>
      ) : error ? (
        <Text className="text-cyber-red mt-2">{error}</Text>
      ) : envAddress ? (
        <Flex direction="column" className="space-y-1 mt-2">
          <Text className="text-cyber-blue">Using fallback address:</Text>
          <Text className="text-sm break-all">{envAddress}</Text>
          <Text className="text-cyber-yellow">Balance: {balance} i</Text>
        </Flex>
      ) : (
        <Text className="text-cyber-magenta mt-2">Please set VITE_IOTA_ADDRESS in your .env</Text>
      )}

      <hr className="border-cyber-border my-4" />

      <OwnedObjects />
    </Container>
  );
}
