# Confidential Trace

A privacy-preserving travel registry application built on Fully Homomorphic Encryption (FHE) technology, enabling users to record and manage their travel history with complete confidentiality on the blockchain.

## Overview

Confidential Trace is a decentralized application (dApp) that revolutionizes how travel data is stored and managed on blockchain networks. By leveraging Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine), users can record their travel visits with country and city information that remains encrypted on-chain, ensuring privacy while maintaining the benefits of blockchain transparency and immutability.

### What Makes This Project Unique

Traditional blockchain applications expose all data publicly on-chain, making privacy-sensitive information like travel history vulnerable. Confidential Trace solves this by utilizing fully homomorphic encryption, which allows computations on encrypted data without decryption. Your travel records are stored encrypted on the blockchain and can only be decrypted by you, the owner.

## Key Features

### Privacy-First Architecture
- **End-to-End Encryption**: Travel data (country and city IDs) are encrypted client-side before being submitted to the blockchain
- **On-Chain Privacy**: All sensitive data remains encrypted on the blockchain, invisible to other users and even blockchain explorers
- **User-Controlled Decryption**: Only the data owner can decrypt their travel records using their private key
- **Zero-Knowledge Proofs**: Cryptographic proofs ensure data validity without revealing actual values

### Blockchain Security
- **Immutable Records**: Travel history is permanently recorded on the blockchain with tamper-proof guarantees
- **Decentralized Storage**: No central authority controls or can access your travel data
- **Smart Contract Verification**: All operations are governed by transparent, auditable smart contracts
- **Multi-Network Support**: Deployable on Ethereum Sepolia testnet with plans for mainnet expansion

### User-Friendly Interface
- **Modern React UI**: Clean, responsive interface built with React 19 and TypeScript
- **Wallet Integration**: Seamless Web3 wallet connection via RainbowKit
- **Real-Time Updates**: Instant feedback on encryption, transaction submission, and confirmation
- **Interactive History**: View and decrypt your encrypted travel records on-demand

## Problems Solved

### 1. **Travel Privacy Concerns**
Traditional travel tracking systems and loyalty programs collect extensive personal data without adequate privacy protections. Confidential Trace ensures your travel patterns remain confidential while still being verifiable on-chain.

### 2. **Data Ownership**
Centralized travel platforms own your data and can monetize it without consent. With Confidential Trace, you maintain complete ownership and control over your travel records.

### 3. **Cross-Border Privacy**
International travel data is often shared between governments and corporations. This application provides a privacy-preserving alternative where you control who can access your information.

### 4. **Blockchain Transparency vs. Privacy**
Standard blockchain applications expose all data publicly. Confidential Trace demonstrates that blockchain transparency and data privacy are not mutually exclusive through FHE technology.

### 5. **Verification Without Disclosure**
Prove you've visited certain locations without revealing your entire travel history, enabling privacy-preserving verification for applications like visa processing or travel insurance.

## Technology Stack

### Smart Contract Layer
- **Solidity ^0.8.24**: Smart contract programming language
- **FHEVM (@fhevm/solidity v0.8.0)**: Fully Homomorphic Encryption virtual machine by Zama
- **Hardhat v2.26.0**: Ethereum development environment
- **TypeChain v8.3.2**: TypeScript bindings for smart contracts
- **Hardhat Deploy v0.11.45**: Deployment management and upgrades

### Frontend Application
- **React v19.1.1**: Modern UI library with latest features
- **TypeScript v5.8.3**: Type-safe development
- **Vite v7.1.6**: Fast build tool and development server
- **Wagmi v2.17.0**: React hooks for Ethereum
- **RainbowKit v2.2.8**: Beautiful wallet connection UI
- **Viem v2.37.6**: TypeScript Ethereum interface
- **@tanstack/react-query v5.89.0**: Powerful async state management

### Encryption & Privacy
- **Zama FHE SDK (@zama-fhe/relayer-sdk v0.2.0)**: Client-side encryption utilities
- **encrypted-types v0.0.4**: Type-safe encrypted data handling
- **Zama Oracle**: Decryption oracle for FHE operations

### Development Tools
- **ESLint v8.57.1**: Code quality and consistency
- **Prettier v3.6.2**: Code formatting
- **Mocha v11.7.1**: Testing framework
- **Chai v4.5.0**: Assertion library
- **Solhint v6.0.0**: Solidity linting
- **Etherscan Verification**: Contract verification and transparency

## Architecture

### Smart Contract Design

The `TravelRegistry` contract is built on FHEVM and implements the following structure:

```solidity
struct Visit {
    euint32 countryId;    // Encrypted country identifier
    euint32 cityId;       // Encrypted city identifier
    uint64 timestamp;      // Public timestamp of visit recording
}
```

**Key Functions:**
- `recordVisit()`: Encrypts and stores a new travel visit with country ID, city ID, and timestamp
- `getVisits()`: Retrieves all encrypted visits for a user
- `getVisit()`: Fetches a specific visit by index
- `getVisitCount()`: Returns the total number of visits for a user

**Security Features:**
- Encrypted country and city IDs using euint32 (32-bit encrypted unsigned integers)
- Per-user access control through FHEVM's permission system
- Input proof validation to ensure encrypted data integrity
- Event emission for off-chain indexing and monitoring

### Frontend Architecture

**Component Structure:**
```
ui/src/
├── App.tsx                 # Application root with providers
├── components/
│   ├── TravelApp.tsx      # Main application container with tab navigation
│   ├── Header.tsx         # Navigation bar with wallet connection
│   ├── VisitForm.tsx      # Form for recording encrypted visits
│   └── VisitHistory.tsx   # Display and decrypt visit records
├── config/
│   ├── wagmi.ts           # Web3 wallet configuration
│   ├── contracts.ts       # Contract ABI and addresses
│   └── locations.ts       # Country and city mappings
├── hooks/
│   ├── useZamaInstance.ts # FHE instance management
│   └── useEthersSigner.ts # Ethers signer integration
└── styles/                # Component-specific CSS modules
```

**Data Flow:**
1. User selects country and city from dropdown menus
2. Client-side encryption using Zama's FHE SDK
3. Encrypted input proof generation
4. Transaction submission to TravelRegistry contract
5. Event emission and on-chain storage
6. Client-side decryption for viewing own records

## Installation & Setup

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Version 7.0.0 or higher
- **MetaMask** or compatible Web3 wallet
- **Git**: For cloning the repository

### Backend Setup (Smart Contracts)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/confidential-trace.git
   cd confidential-trace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Set your private key for deployment
   echo "PRIVATE_KEY=your_private_key_here" > .env

   # Set Infura API key for Sepolia access
   echo "INFURA_API_KEY=your_infura_key" >> .env

   # Optional: Etherscan API key for contract verification
   echo "ETHERSCAN_API_KEY=your_etherscan_key" >> .env
   ```

4. **Compile smart contracts**
   ```bash
   npm run compile
   ```

5. **Run tests**
   ```bash
   # Run local tests with mock FHEVM
   npm run test

   # Run tests on Sepolia testnet
   npm run test:sepolia
   ```

6. **Deploy to Sepolia**
   ```bash
   npm run deploy:sepolia
   ```

   Note the deployed contract address from the console output.

### Frontend Setup

1. **Navigate to UI directory**
   ```bash
   cd ui
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Configure contract address**

   Edit `ui/src/config/contracts.ts` and update the `CONTRACT_ADDRESS` with your deployed contract address:
   ```typescript
   export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress';
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

## Usage Guide

### Recording a Travel Visit

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the header
   - Select your preferred wallet provider (MetaMask, Coinbase Wallet, etc.)
   - Approve the connection request

2. **Select Travel Destination**
   - Navigate to the "Record Visit" tab
   - Choose a country from the dropdown menu
   - Select a city within that country
   - Review your selection preview

3. **Submit Encrypted Visit**
   - Click "Submit Visit" button
   - The application will encrypt your selection locally
   - Approve the transaction in your wallet
   - Wait for blockchain confirmation (typically 15-30 seconds on Sepolia)

4. **Confirmation**
   - Success message appears after confirmation
   - Your visit is now recorded on-chain (encrypted)
   - You're automatically redirected to the "My Visits" tab

### Viewing Your Travel History

1. **Navigate to History Tab**
   - Click "My Visits" in the tab navigation
   - Your encrypted visits will load automatically

2. **Decrypt Your Records**
   - Click the "Decrypt Visits" button
   - Sign the decryption request with your wallet
   - The Zama decryption oracle will process your request
   - Your travel history will display with actual country and city names

3. **Understanding the Display**
   - Encrypted visits show as "***" until decrypted
   - Timestamps are always public (not encrypted)
   - Each visit shows country, city, and recording date

## Development

### Project Structure

```
confidential-trace/
├── contracts/
│   └── TravelRegistry.sol          # Main FHE-enabled smart contract
├── deploy/
│   └── deploy.ts                   # Hardhat deployment script
├── tasks/
│   ├── accounts.ts                 # Account management tasks
│   └── TravelRegistry.ts           # Contract interaction tasks
├── test/
│   ├── TravelRegistry.ts           # Local mock FHEVM tests
│   └── TravelRegistrySepolia.ts    # Sepolia testnet integration tests
├── ui/                             # Frontend React application
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── config/                 # Configuration files
│   │   ├── hooks/                  # Custom React hooks
│   │   └── styles/                 # CSS stylesheets
│   ├── vite.config.ts             # Vite build configuration
│   └── package.json               # Frontend dependencies
├── hardhat.config.ts              # Hardhat configuration
├── package.json                   # Backend dependencies
└── README.md                      # This file
```

### Running Tests

**Local Mock FHEVM Tests:**
```bash
npm run test
```
These tests use Hardhat's built-in FHEVM mock for rapid development and testing without network delays.

**Sepolia Testnet Tests:**
```bash
npm run test:sepolia
```
Integration tests against the actual Sepolia testnet with real FHEVM encryption.

**Coverage Report:**
```bash
npm run coverage
```
Generates a detailed test coverage report for smart contracts.

### Custom Hardhat Tasks

**View Account Balances:**
```bash
npx hardhat accounts
```

**Interact with TravelRegistry:**
```bash
# Record a visit (requires deployed contract)
npx hardhat travel:record --network sepolia --country 1 --city 1

# Get visit count
npx hardhat travel:count --network sepolia --address 0xYourAddress

# View visits
npx hardhat travel:list --network sepolia --address 0xYourAddress
```

### Code Quality

**Linting:**
```bash
# Lint Solidity contracts
npm run lint:sol

# Lint TypeScript files
npm run lint:ts

# Lint all files
npm run lint
```

**Formatting:**
```bash
# Check code formatting
npm run prettier:check

# Auto-fix formatting issues
npm run prettier:write
```

## Deployment

### Local Development Network

1. **Start local Hardhat node:**
   ```bash
   npx hardhat node
   ```

2. **Deploy to local network (in new terminal):**
   ```bash
   npm run deploy:localhost
   ```

### Sepolia Testnet Deployment

1. **Ensure you have Sepolia ETH:**
   - Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

2. **Deploy contract:**
   ```bash
   npm run deploy:sepolia
   ```

3. **Verify contract on Etherscan:**
   ```bash
   npx hardhat verify --network sepolia <DEPLOYED_CONTRACT_ADDRESS>
   ```

### Production Deployment (Frontend)

The frontend is configured for deployment on Netlify:

1. **Build optimized production bundle:**
   ```bash
   cd ui
   npm run build
   ```

2. **Deploy to Netlify:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Deploy
   netlify deploy --prod
   ```

Configuration is available in `ui/netlify.toml`.

### Mainnet Deployment (Future)

Before deploying to Ethereum mainnet:
- [ ] Complete comprehensive security audit
- [ ] Test extensively on testnets
- [ ] Verify FHEVM mainnet compatibility
- [ ] Set up monitoring and alerting
- [ ] Prepare emergency pause mechanisms
- [ ] Document upgrade procedures

## Future Roadmap

### Short-Term (Q2-Q3 2025)

- [ ] **Enhanced Privacy Features**
  - Implement selective disclosure: prove you visited a region without revealing exact city
  - Add time-based privacy: automatic declassification after specified periods
  - Support for encrypted metadata (purpose of visit, duration, etc.)

- [ ] **User Experience Improvements**
  - Mobile-responsive design optimization
  - Progressive Web App (PWA) support for offline capability
  - Multi-language support (i18n)
  - CSV/JSON export of decrypted travel history

- [ ] **Analytics Dashboard**
  - Privacy-preserving travel statistics (encrypted aggregations)
  - Visual world map showing encrypted travel footprint
  - Streak tracking and gamification elements

### Mid-Term (Q4 2025 - Q1 2026)

- [ ] **Social Features**
  - Privacy-preserving travel recommendations
  - Encrypted friend network (prove mutual visits without revealing locations)
  - Share specific visits with selected contacts
  - Travel badge NFTs (earned for encrypted milestones)

- [ ] **Integration Ecosystem**
  - API for third-party applications
  - Travel insurance integration with privacy-preserving claims
  - Loyalty program partnerships with encrypted point accrual
  - Government/visa application integration (selective disclosure)

- [ ] **Advanced Smart Contract Features**
  - Visit verification oracles
  - Multi-signature visit confirmation (for group travel)
  - Encrypted annotations and notes per visit
  - Support for ERC-721 travel proof tokens

### Long-Term (2026+)

- [ ] **Cross-Chain Expansion**
  - Deploy on Ethereum mainnet
  - Support for Polygon, Arbitrum, and other L2s
  - Cross-chain visit synchronization
  - Unified identity across multiple chains

- [ ] **Decentralized Governance**
  - DAO formation for protocol governance
  - Community-driven feature development
  - Treasury management for sustainable development
  - Grant program for ecosystem projects

- [ ] **Enterprise Solutions**
  - Corporate travel management with privacy preservation
  - GDPR-compliant employee travel tracking
  - Supply chain verification with encrypted location proofs
  - Academic research partnerships for FHE applications

- [ ] **Privacy-Tech Innovations**
  - Zero-knowledge proof integration for enhanced privacy
  - Homomorphic computation on aggregate travel data
  - Private set intersection for matching travelers
  - Differential privacy for statistics release

## Security Considerations

### Smart Contract Security

- **Access Control**: Only visit owners can decrypt their data
- **Input Validation**: All encrypted inputs require cryptographic proofs
- **Reentrancy Protection**: State changes follow checks-effects-interactions pattern
- **Overflow Protection**: Solidity 0.8+ built-in overflow checks
- **Upgrade Mechanism**: Contract is non-upgradeable for maximum security (consider proxy pattern in v2)

### Frontend Security

- **Client-Side Encryption**: All sensitive data encrypted before leaving the browser
- **Secure Key Management**: Private keys never transmitted or stored on servers
- **HTTPS Only**: All production deployments use HTTPS
- **Content Security Policy**: Strict CSP headers to prevent XSS
- **Dependency Auditing**: Regular npm audit and dependabot updates

### Known Limitations

- **Decryption Performance**: Decrypting large numbers of visits may take time
- **Gas Costs**: FHE operations are more expensive than standard operations
- **Browser Compatibility**: Requires modern browsers with WASM support
- **Network Dependency**: Relies on Zama's decryption oracle availability

## Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **Report Bugs**: Open issues for any bugs you encounter
2. **Suggest Features**: Share ideas for new features or improvements
3. **Submit Pull Requests**: Fix bugs or implement new features
4. **Improve Documentation**: Help make our docs clearer and more comprehensive
5. **Test and Review**: Test new releases and review pull requests

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Write clean, documented code
   - Add tests for new features
   - Update documentation as needed
4. **Test thoroughly**
   ```bash
   npm run test
   npm run lint
   ```
5. **Commit with descriptive messages**
   ```bash
   git commit -m "feat: add support for encrypted visit notes"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Wait for review and address feedback

### Code Style Guidelines

- Follow existing code formatting (Prettier configuration)
- Write meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Write tests for all new features
- Update TypeScript types appropriately

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

### Key Terms

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Patent use (explicitly excluded)
- ⚠️ No trademark rights granted

See the [LICENSE](LICENSE) file for full details.

## Support & Resources

### Documentation

- **FHEVM Protocol**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Hardhat**: [https://hardhat.org/docs](https://hardhat.org/docs)
- **Wagmi**: [https://wagmi.sh](https://wagmi.sh)
- **RainbowKit**: [https://rainbowkit.com](https://rainbowkit.com)

### Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/confidential-trace/issues)
- **Discussions**: [Join community discussions](https://github.com/yourusername/confidential-trace/discussions)
- **Zama Discord**: [Connect with FHE developers](https://discord.gg/zama)
- **Twitter/X**: [@YourProject](https://twitter.com/yourproject) - Follow for updates

### Getting Help

- Check existing [GitHub Issues](https://github.com/yourusername/confidential-trace/issues)
- Read the [FAQ](https://github.com/yourusername/confidential-trace/wiki/FAQ) (coming soon)
- Join community discussions
- Contact maintainers: [contact@yourproject.com](mailto:contact@yourproject.com)

## Acknowledgments

Built with privacy-first technology from:
- **Zama**: For the groundbreaking FHEVM technology
- **Hardhat**: For the excellent development environment
- **Rainbow**: For beautiful Web3 wallet connection UX
- **The Ethereum Community**: For continuous innovation

Special thanks to all contributors who help make privacy-preserving blockchain applications a reality.

---

**Preserving Privacy, One Journey at a Time**

Built with ❤️ and FHE by the Confidential Trace team
