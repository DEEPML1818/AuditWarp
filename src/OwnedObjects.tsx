import { useEffect, useState } from 'react';
import { Container, Heading, Text } from '@radix-ui/themes';
import { networkConfig } from './networkConfig';

export default function OwnedObjects() {
  const [messageIds, setMessageIds] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchMessages() {
      try {
        const idxUrl = networkConfig.devnet.indexerUrl;
        const res = await fetch(
          `${idxUrl}/api/indexer/v1/messages?index=AUDIT_REPORT`
        );
        if (!res.ok) throw new Error(`Indexer responded ${res.status}`);
        const json = (await res.json()) as { data: string[] };
        setMessageIds(json.data);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch messages');
      }
    }

    fetchMessages();
  }, []);

  return (
    <Container className="mt-4 text-cyber-base">
      <Heading size="2" className="text-cyber-electric">
        Audit Reports on IOTA
      </Heading>

      {error && <Text className="text-cyber-red mt-2">{error}</Text>}

      {!error && messageIds.length === 0 && (
        <Text className="mt-2 text-gray-400">No reports yet.</Text>
      )}

      {messageIds.length > 0 && (
        <ul className="list-disc list-inside mt-2 space-y-1">
          {messageIds.map((id) => (
            <li key={id}>
              <a
                href={`${networkConfig.devnet.jsonRpcUrl.replace(
                  '/api',
                  '/core/v2/messages'
                )}/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyber-lime hover:underline"
              >
                {id}
              </a>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
