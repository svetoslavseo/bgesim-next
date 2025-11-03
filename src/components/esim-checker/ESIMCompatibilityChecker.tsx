'use client';

import { useState, useEffect, useMemo } from 'react';
import ResultsModal from './ResultsModal';
import { Device, DeviceBrand, tabletsData, laptopsData, smartwatchesData } from './deviceData';
import styles from './ESIMCompatibilityChecker.module.css';

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

type DeviceCategory = 'smartphones' | 'tablets' | 'smartwatches' | 'laptops';

const categoryLabels: Record<DeviceCategory, string> = {
  smartphones: 'телефон',
  tablets: 'таблет',
  smartwatches: 'смарт часовник',
  laptops: 'лаптоп'
};

export default function ESIMCompatibilityChecker() {
  const [data, setData] = useState<ESIMData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory>('smartphones');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [modelInput, setModelInput] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foundDevice, setFoundDevice] = useState<Device | null>(null);
  const [searchedModel, setSearchedModel] = useState<string>('');

  // Load JSON data for smartphones
  useEffect(() => {
    fetch('/esim-comp-phones.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load eSIM data:', err));
  }, []);

  // Get device data based on category
  const getCategoryData = (): DeviceBrand[] => {
    switch (selectedCategory) {
      case 'smartphones':
        return data?.smartphones || [];
      case 'tablets':
        return tabletsData;
      case 'smartwatches':
        return smartwatchesData;
      case 'laptops':
        return laptopsData;
      default:
        return [];
    }
  };

  // Get unique brands sorted alphabetically
  const brands = useMemo(() => {
    const categoryData = getCategoryData();
    return categoryData
      .map(s => s.brand)
      .sort((a, b) => a.localeCompare(b, 'bg'));
  }, [data, selectedCategory]);

  // Get all models for selected brand
  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    
    const categoryData = getCategoryData();
    const brandData = categoryData.find(s => s.brand === selectedBrand);
    if (!brandData) return [];
    
    const models: Device[] = [];
    brandData.series.forEach(series => {
      models.push(...series.devices);
    });
    
    return models.sort((a, b) => a.model.localeCompare(b.model, 'bg'));
  }, [data, selectedCategory, selectedBrand]);

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(e.target.value as DeviceCategory);
    setSelectedBrand(''); // Reset brand when category changes
    setModelInput(''); // Reset model input when category changes
  };

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
    if (!selectedBrand || !modelInput.trim()) return;

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

  const categoryLabel = categoryLabels[selectedCategory];

  return (
    <>
      <div className={styles.checker}>
        <div className={styles.toolCard}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Избери тип устройство:
            </label>
            <div className={styles.categorySelector}>
              <label className={`${styles.categoryOption} ${selectedCategory === 'smartphones' ? styles.active : ''}`}>
                <input
                  type="radio"
                  name="category"
                  value="smartphones"
                  checked={selectedCategory === 'smartphones'}
                  onChange={handleCategoryChange}
                  className={styles.radioInput}
                />
                <span className={styles.categoryLabel}>Смартфони</span>
              </label>
              <label className={`${styles.categoryOption} ${selectedCategory === 'tablets' ? styles.active : ''}`}>
                <input
                  type="radio"
                  name="category"
                  value="tablets"
                  checked={selectedCategory === 'tablets'}
                  onChange={handleCategoryChange}
                  className={styles.radioInput}
                />
                <span className={styles.categoryLabel}>Таблети</span>
              </label>
              <label className={`${styles.categoryOption} ${selectedCategory === 'smartwatches' ? styles.active : ''}`}>
                <input
                  type="radio"
                  name="category"
                  value="smartwatches"
                  checked={selectedCategory === 'smartwatches'}
                  onChange={handleCategoryChange}
                  className={styles.radioInput}
                />
                <span className={styles.categoryLabel}>Смарт часовници</span>
              </label>
              <label className={`${styles.categoryOption} ${selectedCategory === 'laptops' ? styles.active : ''}`}>
                <input
                  type="radio"
                  name="category"
                  value="laptops"
                  checked={selectedCategory === 'laptops'}
                  onChange={handleCategoryChange}
                  className={styles.radioInput}
                />
                <span className={styles.categoryLabel}>Лаптопи</span>
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="brand-select" className={styles.label}>
              Избери марката на твоя {categoryLabel}:
            </label>
            <select
              id="brand-select"
              value={selectedBrand}
              onChange={handleBrandChange}
              className={styles.select}
              disabled={brands.length === 0}
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
      </div>

      <ResultsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        device={foundDevice}
        brand={selectedBrand}
        searchedModel={searchedModel}
        disclaimer={selectedCategory === 'smartphones' ? (data?.disclaimer || '') : ''}
      />
    </>
  );
}

