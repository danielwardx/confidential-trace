import { useMemo, useState } from 'react';
import { Header } from './Header';
import { VisitForm } from './VisitForm';
import { VisitHistory } from './VisitHistory';
import { CONTRACT_ADDRESS } from '../config/contracts';
import '../styles/TravelApp.css';

type TabKey = 'record' | 'history';

export function TravelApp() {
  const [activeTab, setActiveTab] = useState<TabKey>('record');
  const [refreshKey, setRefreshKey] = useState(0);

  const isContractReady = useMemo(
    () => CONTRACT_ADDRESS.toLowerCase() !== '0x0000000000000000000000000000000000000000',
    []
  );

  const handleVisitRecorded = () => {
    setRefreshKey((prev) => prev + 1);
    setActiveTab('history');
  };

  return (
    <div className="travel-app">
      <Header />
      <main className="main-content">
        {!isContractReady && (
          <div className="contract-warning">
            Please update the contract address to interact with the Travel Registry.
          </div>
        )}

        <div className="tab-navigation">
          <nav className="tab-nav">
            <button
              onClick={() => setActiveTab('record')}
              className={`tab-button ${activeTab === 'record' ? 'active' : 'inactive'}`}
            >
              Record Visit
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`tab-button ${activeTab === 'history' ? 'active' : 'inactive'}`}
            >
              My Visits
            </button>
          </nav>
        </div>

        {activeTab === 'record' && (
          <VisitForm onVisitRecorded={handleVisitRecorded} isContractReady={isContractReady} />
        )}
        {activeTab === 'history' && (
          <VisitHistory refreshKey={refreshKey} isContractReady={isContractReady} />
        )}
      </main>
    </div>
  );
}
