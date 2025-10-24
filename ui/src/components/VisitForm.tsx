import { useMemo, useState } from 'react';
import { Contract } from 'ethers';
import { useAccount } from 'wagmi';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config/contracts';
import { COUNTRIES, getCitiesForCountry, getCountryName, getCityName } from '../config/locations';
import '../styles/VisitForm.css';

type VisitFormProps = {
  onVisitRecorded?: () => void;
  isContractReady: boolean;
};

export function VisitForm({ onVisitRecorded, isContractReady }: VisitFormProps) {
  const { address } = useAccount();
  const { instance, isLoading: zamaLoading, error: zamaError } = useZamaInstance();
  const signerPromise = useEthersSigner();

  const [selectedCountry, setSelectedCountry] = useState<number | ''>('');
  const [selectedCity, setSelectedCity] = useState<number | ''>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const availableCities = useMemo(() => {
    if (selectedCountry === '') {
      return [];
    }
    return getCitiesForCountry(Number(selectedCountry));
  }, [selectedCountry]);

  const resetForm = () => {
    setSelectedCountry('');
    setSelectedCity('');
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!isContractReady) {
      setFormError('Contract address is not configured.');
      return;
    }

    if (!instance || !address || !signerPromise) {
      setFormError('Please connect your wallet and ensure encryption is ready.');
      return;
    }

    if (selectedCountry === '' || selectedCity === '') {
      setFormError('Please select both a country and a city.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setStatusMessage('Encrypting selection...');

    try {
      const countryId = Number(selectedCountry);
      const cityId = Number(selectedCity);

      const encryptedInput = await instance
        .createEncryptedInput(CONTRACT_ADDRESS, address)
        .add32(countryId)
        .add32(cityId)
        .encrypt();

      setStatusMessage('Submitting transaction...');

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not available');
      }

      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const timestamp = BigInt(Math.floor(Date.now() / 1000));

      const tx = await contract.recordVisit(
        encryptedInput.handles[0],
        encryptedInput.handles[1],
        encryptedInput.inputProof,
        timestamp,
      );

      setStatusMessage(`Waiting for confirmation (${tx.hash.slice(0, 10)}...)`);
      await tx.wait();

      setStatusMessage('Visit recorded successfully.');
      resetForm();
      onVisitRecorded?.();
    } catch (error) {
      console.error('Failed to record visit', error);
      setFormError(error instanceof Error ? error.message : 'Unknown error');
      setStatusMessage('');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  return (
    <div className="visit-form-container">
      <div className="visit-form-card">
        <h2 className="visit-form-title">Record a New Visit</h2>
        <p className="visit-form-description">
          Select a country and city you have visited. Your selection is encrypted before being added on-chain.
        </p>

        <form className="visit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="country" className="form-label">Country</label>
            <select
              id="country"
              className="form-select"
              disabled={!isContractReady || zamaLoading || isSubmitting}
              value={selectedCountry}
              onChange={(event) => {
                const value = event.target.value === '' ? '' : Number(event.target.value);
                setSelectedCountry(value);
                setSelectedCity('');
              }}
            >
              <option value="">Select a country</option>
              {COUNTRIES.map((country) => (
                <option value={country.id} key={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="city" className="form-label">City</label>
            <select
              id="city"
              className="form-select"
              disabled={!isContractReady || zamaLoading || isSubmitting || selectedCountry === ''}
              value={selectedCity}
              onChange={(event) => {
                const value = event.target.value === '' ? '' : Number(event.target.value);
                setSelectedCity(value);
              }}
            >
              <option value="">Select a city</option>
              {availableCities.map((city) => (
                <option value={city.id} key={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            {selectedCity !== '' && (
              <p className="selection-preview">
                Recording visit to {getCityName(Number(selectedCity))}, {getCountryName(Number(selectedCountry))}
              </p>
            )}
          </div>

          {zamaLoading && <p className="info-message">Preparing encryption service...</p>}
          {zamaError && <p className="error-message">{zamaError}</p>}
          {formError && <p className="error-message">{formError}</p>}
          {statusMessage && <p className="status-message">{statusMessage}</p>}

          <button
            type="submit"
            className="submit-button"
            disabled={!isContractReady || zamaLoading || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Visit'}
          </button>
        </form>
      </div>
    </div>
  );
}
