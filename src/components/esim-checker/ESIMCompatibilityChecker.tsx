'use client';

import { useState, useEffect, useMemo } from 'react';
import ResultsModal from './ResultsModal';
import styles from './ESIMCompatibilityChecker.module.css';

interface Device {
  model: string;
  notes: string | null;
}

interface Series {
  series_name: string;
  devices: Device[];
}

interface Smartphone {
  brand: string;
  series: Series[];
}

interface ESIMData {
  disclaimer: string;
  smartphones: Smartphone[];
}

export default function ESIMCompatibilityChecker() {
  const [data, setData] = useState<ESIMData | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [modelInput, setModelInput] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foundDevice, setFoundDevice] = useState<Device | null>(null);
  const [searchedModel, setSearchedModel] = useState<string>('');

  // Load JSON data
  useEffect(() => {
    fetch('/esim-comp-phones.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load eSIM data:', err));
  }, []);

  // Get unique brands sorted alphabetically
  const brands = useMemo(() => {
    if (!data) return [];
    return data.smartphones
      .map(s => s.brand)
      .sort((a, b) => a.localeCompare(b, 'bg'));
  }, [data]);

  // Get all models for selected brand
  const availableModels = useMemo(() => {
    if (!data || !selectedBrand) return [];
    
    const smartphone = data.smartphones.find(s => s.brand === selectedBrand);
    if (!smartphone) return [];
    
    const models: Device[] = [];
    smartphone.series.forEach(series => {
      models.push(...series.devices);
    });
    
    return models.sort((a, b) => a.model.localeCompare(b.model, 'bg'));
  }, [data, selectedBrand]);

  // Handle brand selection
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBrand(e.target.value);
    setModelInput(''); // Reset model input when brand changes
  };

  // Handle model input with debouncing for performance
  const handleModelInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModelInput(e.target.value);
  };

  // Search for device
  const handleSearch = () => {
    if (!data || !selectedBrand || !modelInput.trim()) return;

    const normalizedInput = modelInput.trim().toLowerCase();
    setSearchedModel(modelInput.trim());

    // Find in available models
    const device = availableModels.find(d => 
      d.model.toLowerCase().includes(normalizedInput) ||
      normalizedInput.includes(d.model.toLowerCase())
    );

    setFoundDevice(device || null);
    setIsModalOpen(true);
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedBrand && modelInput.trim()) {
      handleSearch();
    }
  };

  const isSearchEnabled = selectedBrand && modelInput.trim().length > 0;

  return (
    <>
      <div className={styles.checker}>
        <div className={styles.toolCard}>
          <div className={styles.formGroup}>
            <label htmlFor="brand-select" className={styles.label}>
              Избери марката на твоя телефон:
            </label>
            <select
              id="brand-select"
              value={selectedBrand}
              onChange={handleBrandChange}
              className={styles.select}
            >
              <option value="">--Марка--</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="model-input" className={styles.label}>
              Модел:
            </label>
            <input
              id="model-input"
              type="text"
              value={modelInput}
              onChange={handleModelInput}
              onKeyPress={handleKeyPress}
              disabled={!selectedBrand}
              placeholder={selectedBrand ? "Започнете да пишете модела..." : "Изберете марка първо"}
              className={styles.input}
              list="model-suggestions"
              autoComplete="off"
            />
            {selectedBrand && availableModels.length > 0 && (
              <datalist id="model-suggestions">
                {availableModels.map((device, idx) => (
                  <option key={idx} value={device.model} />
                ))}
              </datalist>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={!isSearchEnabled}
            className={styles.searchButton}
          >
            Проверка
          </button>
        </div>

        <div className={styles.helperText}>
          <p>Чудите се дали телефонът ви поддържа eSIM? </p>
          <p>Просто изберете марката, въведете модела си и проверете веднага! </p>
          <p>Останете свързани с най-новата eSIM технология. ✅</p>
        </div>
      </div>

      <ResultsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        device={foundDevice}
        brand={selectedBrand}
        searchedModel={searchedModel}
        disclaimer={data?.disclaimer || ''}
      />
    </>
  );
}

