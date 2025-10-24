import { useEffect, useMemo, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config/contracts';
import { getCountryName, getCityName } from '../config/locations';
import '../styles/VisitHistory.css';

type VisitHistoryProps = {
  refreshKey: number;
  isContractReady: boolean;
};

type VisitStruct = {
  countryId: string;
  cityId: string;
  timestamp: bigint;
};

export function VisitHistory({ refreshKey, isContractReady }: VisitHistoryProps) {
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const signerPromise = useEthersSigner();

  const [decryptionError, setDecryptionError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedVisits, setDecryptedVisits] = useState<Record<number, { country: string; city: string }>>({});

  const {
    data,
    isLoading,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getVisits',
    args: address && isContractReady ? [address] : undefined,
    query: {
      enabled: Boolean(address) && isContractReady,
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (refreshKey > 0 && refetch) {
      refetch();
    }
  }, [refreshKey, refetch]);

  useEffect(() => {
    setDecryptedVisits({});
  }, [data]);

  const visits = useMemo(() => {
    if (!data) {
      return [] as VisitStruct[];
    }

    return (data as VisitStruct[]).map((visit) => ({
      countryId: visit.countryId,
      cityId: visit.cityId,
      timestamp: visit.timestamp,
    }));
  }, [data]);

  const decryptVisits = async () => {
    if (!instance) {
      setDecryptionError('Encryption service is unavailable.');
      return;
    }
    if (!address) {
      setDecryptionError('Connect your wallet to decrypt your visits.');
      return;
    }
    if (!visits.length) {
      setDecryptionError('No visits to decrypt.');
      return;
    }

    const signer = signerPromise ? await signerPromise : undefined;
    if (!signer) {
      setDecryptionError('Signer not available. Connect your wallet.');
      return;
    }

    setIsDecrypting(true);
    setDecryptionError(null);

    try {
      const keypair = instance.generateKeypair();
      const contracts = [CONTRACT_ADDRESS];
      const startTime = Math.floor(Date.now() / 1000).toString();
      const durationDays = '7';

      const handleContractPairs = visits.flatMap((visit) => [
        {
          handle: visit.countryId,
          contractAddress: CONTRACT_ADDRESS,
        },
        {
          handle: visit.cityId,
          contractAddress: CONTRACT_ADDRESS,
        },
      ]);

      const eip712 = instance.createEIP712(keypair.publicKey, contracts, startTime, durationDays);

      const signature = await signer.signTypedData(
        eip712.domain,
        {
          UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
        },
        eip712.message,
      );

      const result = await instance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contracts,
        address,
        startTime,
        durationDays,
      );

      const decrypted: Record<number, { country: string; city: string }> = {};

      visits.forEach((visit, index) => {
        const countryIdValue = result[visit.countryId as keyof typeof result] ?? '0';
        const cityIdValue = result[visit.cityId as keyof typeof result] ?? '0';

        const countryName = getCountryName(Number(countryIdValue));
        const cityName = getCityName(Number(cityIdValue));

        decrypted[index] = {
          country: countryName,
          city: cityName,
        };
      });

      setDecryptedVisits(decrypted);
    } catch (error) {
      console.error('Failed to decrypt visits', error);
      setDecryptionError(error instanceof Error ? error.message : 'Unknown decryption error');
    } finally {
      setIsDecrypting(false);
    }
  };

  if (!address) {
    return (
      <div className="visit-history-container">
        <div className="visit-card">
          <p className="info-message">Connect your wallet to view encrypted visits.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="visit-history-container">
      <div className="visit-card">
        <div className="visit-card-header">
          <h2 className="visit-card-title">Your Travel History</h2>
          <button
            className="decrypt-button"
            onClick={decryptVisits}
            disabled={!isContractReady || isDecrypting || !visits.length}
          >
            {isDecrypting ? 'Decrypting...' : 'Decrypt Visits'}
          </button>
        </div>

        {isLoading && <p className="info-message">Loading encrypted visits...</p>}
        {decryptionError && <p className="error-message">{decryptionError}</p>}

        {!isLoading && !visits.length && (
          <p className="info-message">No visits recorded yet.</p>
        )}

        <div className="visit-list">
          {visits.map((visit, index) => {
            const decrypted = decryptedVisits[index];
            const timestamp = Number(visit.timestamp) * 1000;
            const visitDate = Number.isFinite(timestamp)
              ? new Date(timestamp).toLocaleString()
              : 'Unknown';

            return (
              <div className="visit-item" key={`${visit.countryId}-${visit.cityId}-${index}`}>
                <div className="visit-row">
                  <span className="visit-label">Country</span>
                  <span className="visit-value">{decrypted ? decrypted.country : '***'}</span>
                </div>
                <div className="visit-row">
                  <span className="visit-label">City</span>
                  <span className="visit-value">{decrypted ? decrypted.city : '***'}</span>
                </div>
                <div className="visit-row">
                  <span className="visit-label">Recorded At</span>
                  <span className="visit-value">{visitDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
