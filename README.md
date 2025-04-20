# 🛡️ AuditWarp  
**AI-Powered Smart Contract Audits for Move, Secured On-Chain with Sui + Cross-Chain Access via Wormhole**

### 📄 Sui Deployment (Testnet)

- **Sui Contract Address (Testnet):** `0x0d865f8b0ca4c353fbc142af6b74d88c4ec49d28c970b58c48b5599e1d314914`  
- **Deployer Address (Testnet):** `0x768478578364d08dfc4e7c114a883602289256f0e603b64f58eb14ac288ab673`


## 🧠 Architecture Overview

- **User** sends code to **Frontend**  
- **Frontend** calls the **AI Agent** _and_ directly writes to **IPFS**  
- **AI Agent** sends analysis to a **Server**, which generates the **PDF Report**  
- **PDF Report** is uploaded to **IPFS**  
- **IPFS** then feeds into the **Sui NFT Mint**  
- Finally, the **Wormhole SDK** bridges the proof‑NFT out to any **EVM Chain** and back  

---

- **Frontend**: Built with `Next.js`, `Tailwind CSS`, `Radix UI`, `Vite`
- **AI Engine**: Uses `OpenAI API` for LLM-based code analysis (pluggable)
- **Storage**: Generates PDF reports → uploads to `IPFS` (via Pinata)
- **Proof**: Mints Sui NFTs containing audit metadata and IPFS hash
- **Cross-chain Access**: Wormhole SDK enables EVM ↔ Sui communication
- **Wallets Supported**: `DappKit` (Sui), `Web3-react` (EVM)

---

## ⚙️ Core Functions

| Module             | Description |
|--------------------|-------------|
| `analyzeCode()`    | Sends Move code to AI for audit |
| `generatePDF()`    | Converts audit results into styled PDF |
| `uploadToIPFS()`   | Uploads generated PDF via Pinata API |
| `mintAuditNFT()`   | Mints NFT on Sui with audit metadata |
| `wormholeBridge()` | Facilitates cross-chain access & token payments |
| `connectWallet()`  | Initializes wallet connection (Sui or EVM) |

---

## 🚀 Installation & Local Setup

### 1. Clone the Repo

```bash
git clone https://github.com/your-org/auditwarp.git
cd auditwarp
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create .env File

```bash
OPENAI_API_KEY=your_openai_key
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_API_KEY=your_pinata_secret
NEXT_PUBLIC_SUI_RPC=https://fullnode.devnet.sui.io/
WORMHOLE_RPC=https://wormhole-v2-mainnet.chainstacklabs.com
```

### 4. Run Locally

```bash
npm run dev
# or
yarn dev
```
**Visit:** <http://localhost:3000>

### 🛠 Dependencies
- Next.js
- Vite
- OpenAI API
- Pinata IPFS
- Sui SDK / DappKit
- Wormhole SDK
- React-PDF
- Web3-React

### 📁 Folder Structure (Partial)

auditwarp/
├── components/
│   └── AuditForm.jsx
├── pages/
│   ├── index.tsx
├── lib/
│   ├── ai.ts        # AI call logic
│   ├── ipfs.ts      # Pinata interaction
│   ├── nft.ts       # Minting audit NFTs
│   └── wormhole.ts  # Cross-chain comms
├── public/
├── styles/
├── .env
└── README.md

### 🧪 Coming Soon
- Multi-agent AI audit consensus (voting mechanism)
- Public explorer for verified audits
- Tokenized credit system for audits
- Plugin system for third-party LLMs and chains

### 🤝 Contributing
PRs and issues are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### 🔐 License
MIT License © 2025 AuditWarp Contributors


