'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { MdPhoneAndroid, MdTablet, MdWatch, MdLaptop } from 'react-icons/md';
import styles from './DeviceList.module.css';

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

interface Tablet {
  brand: string;
  series: Series[];
}

interface Laptop {
  brand: string;
  series: Series[];
}

interface Smartwatch {
  brand: string;
  series: Series[];
}

type DeviceCategory = 'smartphones' | 'smartwatches' | 'tablets' | 'laptops';

// Tablets data based on screenshot
const tabletsData: Tablet[] = [
  {
    brand: 'Apple',
    series: [
      {
        series_name: 'iPad Pro',
        devices: [
          { model: 'iPad Pro 13-inch (M4) Wi-Fi + Cellular*', notes: null },
          { model: 'iPad Pro 12.9-inch (6th generation) Wi-Fi + Cellular', notes: null },
          { model: 'iPad Pro 12.9-inch (5th generation) Wi-Fi + Cellular', notes: null },
          { model: 'iPad Pro 12.9-inch (4th generation) Wi-Fi + Cellular', notes: null },
          { model: 'iPad Pro 12.9-inch (3rd generation) Wi-Fi + Cellular', notes: null },
          { model: 'iPad Pro 11-inch (M4) Wi-Fi + Cellular*', notes: null },
          { model: 'iPad Pro 11-inch (4th generation) Wi-Fi + Cellular', notes: null },
          { model: 'iPad Pro 11-inch (3rd generation) Wi-Fi + Cellular', notes: null },
          { model: 'iPad Pro 11-inch (2nd generation) Wi-Fi + Cellular', notes: null },
          { model: 'iPad Pro 11-inch (1st generation) Wi-Fi + Cellular', notes: null },
        ]
      },
      {
        series_name: 'iPad Air',
        devices: [
          { model: 'iPad Air 13-inch (M2) Wi-Fi + Cellular*', notes: null },
          { model: 'iPad Air 11-inch (M2) Wi-Fi + Cellular*', notes: null },
          { model: 'iPad Air (5th generation) Wi-Fi + Cellular', notes: null },
          { model: 'iPad Air (4th generation) Wi-Fi + Cellular', notes: null },
          { model: 'iPad Air (3rd generation) Wi-Fi + Cellular', notes: null },
        ]
      },
      {
        series_name: 'iPad mini',
        devices: [
          { model: 'iPad mini (6th generation) Wi-Fi + Cellular', notes: null },
          { model: 'iPad mini (5th generation) Wi-Fi + Cellular', notes: null },
        ]
      },
      {
        series_name: 'iPad',
        devices: [
          { model: 'iPad (10th generation) Wi-Fi + Cellular', notes: null },
          { model: 'iPad (9th generation) Wi-Fi + Cellular', notes: null },
          { model: 'iPad (8th generation) Wi-Fi + Cellular', notes: null },
          { model: 'iPad (7th generation) Wi-Fi + Cellular', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Samsung',
    series: [
      {
        series_name: 'Galaxy Tab S9 Series',
        devices: [
          { model: 'Samsung Galaxy Tab S9', notes: null },
          { model: 'Samsung Galaxy Tab S9+', notes: null },
          { model: 'Samsung Galaxy Tab S9 Ultra', notes: null },
          { model: 'Samsung Galaxy Tab S9 FE', notes: null },
          { model: 'Samsung Galaxy Tab S9 FE+', notes: null },
        ]
      }
    ]
  }
];

// Laptops data based on screenshot
const laptopsData: Laptop[] = [
  {
    brand: 'Acer',
    series: [
      {
        series_name: 'Acer Series',
        devices: [
          { model: 'TravelMate P2', notes: null },
          { model: 'TravelMate Spin P4', notes: null },
          { model: 'TravelMate P6', notes: null },
          { model: 'Acer Spin 7', notes: null },
          { model: 'Acer Swift 3', notes: null },
          { model: 'Acer Swift 7', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Asus',
    series: [
      {
        series_name: 'Asus Series',
        devices: [
          { model: 'Asus Mini Transformer T103HAF', notes: null },
          { model: 'Asus NovaGo TP370QL', notes: null },
          { model: 'Asus Transbook Mini', notes: null },
          { model: 'Asus VivoBook Flip 14 TP401NA', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Dell',
    series: [
      {
        series_name: 'Dell Latitude Series',
        devices: [
          { model: 'Dell Latitude 7440', notes: null },
          { model: 'Dell Latitude 7210 2-in-1', notes: null },
          { model: 'Dell Latitude 9410', notes: null },
          { model: 'Dell Latitude 9440', notes: null },
          { model: 'Dell Latitude 7310', notes: null },
          { model: 'Dell Latitude 7320', notes: null },
          { model: 'Dell Latitude 7410', notes: null },
          { model: 'Dell Latitude 9420', notes: null },
          { model: 'Dell Latitude 9510', notes: null },
          { model: 'Dell Latitude 5410', notes: null },
          { model: 'Dell Latitude 5420', notes: null },
          { model: 'Dell Latitude 5411', notes: null },
          { model: 'Dell Latitude 5511', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'HP',
    series: [
      {
        series_name: 'HP Series',
        devices: [
          { model: 'HP Elite Dragonfly G2', notes: null },
          { model: 'HP Elite Folio 13', notes: null },
          { model: 'HP Elitebook G5', notes: null },
          { model: 'HP Probook G5', notes: null },
          { model: 'HP Zbook G5', notes: null },
          { model: 'HP Spectre Folio 13', notes: null },
          { model: 'HP Spectre x360', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Lenovo',
    series: [
      {
        series_name: 'Lenovo Series',
        devices: [
          { model: 'Ideapad Flex 50', notes: null },
          { model: 'Miix 630', notes: null },
          { model: 'ThinkPad X1 Titanium Yoga 2 in 1', notes: null },
          { model: 'ThinkPad X1 Carbon Gen 9', notes: null },
          { model: 'ThinkPad X1 Fold', notes: null },
          { model: 'ThinkPad X1 Nano', notes: null },
          { model: 'ThinkPad X12 Detachable', notes: null },
          { model: 'X1 Fold', notes: null },
          { model: 'Yoga C630', notes: null },
          { model: 'Yoga 520', notes: null },
          { model: 'Yoga 720 convertible', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Panasonic',
    series: [
      {
        series_name: 'Panasonic Series',
        devices: [
          { model: 'Panasonic Toughbook G2', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Samsung',
    series: [
      {
        series_name: 'Samsung Galaxy Book Series',
        devices: [
          { model: 'Samsung Galaxy Book 2', notes: null },
          { model: 'Samsung Galaxy Book 3', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Surface',
    series: [
      {
        series_name: 'Surface Series',
        devices: [
          { model: 'Surface Pro 9', notes: null },
          { model: 'Surface Pro 8', notes: null },
          { model: 'Surface Pro 7', notes: null },
          { model: 'Surface Go 3', notes: null },
          { model: 'Surface Go 2', notes: null },
          { model: 'Surface Pro LTE', notes: null },
          { model: 'Surface Pro X', notes: null },
          { model: 'Surface Pro 5 LTE Advanced', notes: null },
          { model: 'Surface Duo 2', notes: null },
          { model: 'Surface Duo', notes: null },
        ]
      }
    ]
  }
];

// Smartwatches data based on screenshot
const smartwatchesData: Smartwatch[] = [
  {
    brand: 'Apple',
    series: [
      {
        series_name: 'Apple Watch Series',
        devices: [
          { model: 'Apple Watch Series 3', notes: null },
          { model: 'Apple Watch Series 4', notes: null },
          { model: 'Apple Watch Series 5', notes: null },
          { model: 'Apple Watch Series 6', notes: null },
          { model: 'Apple Watch Series 7', notes: null },
          { model: 'Apple Watch Series 8', notes: null },
          { model: 'Apple Watch Series 9', notes: null },
          { model: 'Apple Watch Ultra LTE', notes: null },
          { model: 'Apple Watch Ultra 2', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Samsung',
    series: [
      {
        series_name: 'Samsung Watch Series',
        devices: [
          { model: 'Samsung Watch', notes: null },
          { model: 'Samsung Watch Active 2 4G', notes: null },
          { model: 'Samsung Watch Active 3 4G', notes: null },
          { model: 'Samsung Gear 2 3G Classic', notes: null },
          { model: 'Samsung Gear S3 Frontier (LTE)', notes: null },
          { model: 'Samsung Galaxy Watch 3 LTE', notes: null },
          { model: 'Samsung Galaxy Watch 4 LTE', notes: null },
          { model: 'Samsung Galaxy Watch 5 LTE', notes: null },
          { model: 'Samsung Galaxy Watch 5 Pro', notes: null },
          { model: 'Samsung Galaxy Watch 6', notes: null },
          { model: 'Samsung Galaxy Watch 6 Classic', notes: null },
          { model: 'Samsung Galaxy Watch 7', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Google',
    series: [
      {
        series_name: 'Google Pixel Watch Series',
        devices: [
          { model: 'Google Pixel Watch LTE', notes: null },
          { model: 'Google Pixel Watch 2', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Xiaomi',
    series: [
      {
        series_name: 'Xiaomi Watch Series',
        devices: [
          { model: 'Xiaomi Watch 2 Pro', notes: null },
          { model: 'Xiaomi Watch S3', notes: null },
          { model: 'Xiaomi Mi Watch', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Oppo',
    series: [
      {
        series_name: 'Oppo Watch Series',
        devices: [
          { model: 'Oppo Watch X2 Mini', notes: null },
          { model: 'Oppo Watch', notes: null },
          { model: 'Oppo Watch 2', notes: null },
          { model: 'Oppo Watch SE', notes: null },
          { model: 'Oppo Watch Pro 3', notes: null },
          { model: 'Oppo Watch Pro 4', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'TicWatch',
    series: [
      {
        series_name: 'TicWatch Series',
        devices: [
          { model: 'TicWatch Pro 5', notes: null },
          { model: 'TicWatch Pro 4G/LTE', notes: null },
          { model: 'TicWatch Pro 3 Ultra', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Huawei',
    series: [
      {
        series_name: 'Huawei Watch Series',
        devices: [
          { model: 'Huawei Watch 2', notes: null },
          { model: 'Huawei Watch 2 Pro', notes: null },
          { model: 'Huawei Watch 3', notes: null },
          { model: 'Huawei Watch 3 Active 4G', notes: null },
          { model: 'Huawei Watch 3 Pro', notes: null },
          { model: 'Huawei Watch 4', notes: null },
          { model: 'Huawei Watch 4 Pro', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Amazfit',
    series: [
      {
        series_name: 'Amazfit Series',
        devices: [
          { model: 'Amazfit Nexo', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Vivo',
    series: [
      {
        series_name: 'Vivo Watch Series',
        devices: [
          { model: 'Vivo Watch 2', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Fossil',
    series: [
      {
        series_name: 'Fossil Series',
        devices: [
          { model: 'Fossil Gen 5 LTE', notes: null },
          { model: 'Fossil Gen 6 LTE', notes: null },
        ]
      }
    ]
  },
  {
    brand: 'Garmin',
    series: [
      {
        series_name: 'Garmin Series',
        devices: [
          { model: 'Garmin Forerunner 945 LTE', notes: null },
        ]
      }
    ]
  }
];

export default function DeviceList() {
  const [data, setData] = useState<ESIMData | null>(null);
  const [activeCategory, setActiveCategory] = useState<DeviceCategory>('smartphones');
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());

  // Load JSON data with performance optimization
  useEffect(() => {
    // Use requestIdleCallback if available for better performance
    const loadData = () => {
      fetch('/esim-comp-phones.json', {
        // Add cache headers for better performance
        cache: 'force-cache',
      })
        .then(res => res.json())
        .then(setData)
        .catch(err => console.error('Failed to load eSIM data:', err));
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadData, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(loadData, 0);
    }
  }, []);

  // Toggle brand expansion - memoized for performance
  const toggleBrand = useCallback((brand: string) => {
    setExpandedBrands(prev => {
      const newSet = new Set(prev);
      if (newSet.has(brand)) {
        newSet.delete(brand);
      } else {
        newSet.add(brand);
      }
      return newSet;
    });
  }, []);

  // Get device priority for sorting (matches screenshot order)
  const getDevicePriority = (model: string): number => {
    // iPhone 17 series
    if (model.includes('17 Pro Max')) return 1;
    if (model.includes('17 Pro')) return 2;
    if (model.includes('17 Plus')) return 3;
    if (model.includes('17') && !model.includes('Plus') && !model.includes('Pro')) return 4;
    
    // iPhone 16 series - order: Pro Max, Plus, Pro, base
    if (model.includes('16 Pro Max')) return 5;
    if (model.includes('16 Plus')) return 6;
    if (model.includes('16 Pro')) return 7;
    if (model.includes('16') && !model.includes('Plus') && !model.includes('Pro')) return 8;
    
    // iPhone 15 series
    if (model.includes('15 Pro Max')) return 9;
    if (model.includes('15 Plus')) return 10;
    if (model.includes('15 Pro')) return 11;
    if (model.includes('15') && !model.includes('Plus') && !model.includes('Pro')) return 12;
    
    // iPhone 14 series
    if (model.includes('14 Pro Max')) return 13;
    if (model.includes('14 Plus')) return 14;
    if (model.includes('14 Pro')) return 15;
    if (model.includes('14') && !model.includes('Plus') && !model.includes('Pro')) return 16;
    
    // iPhone SE
    if (model.includes('SE') && model.includes('2022')) return 17;
    if (model.includes('SE') && model.includes('2020')) return 18;
    
    // iPhone 13 series
    if (model.includes('13 Pro Max')) return 19;
    if (model.includes('13 Pro')) return 20;
    if (model.includes('13 mini')) return 21;
    if (model.includes('13') && !model.includes('mini') && !model.includes('Pro')) return 22;
    
    // iPhone 12 series
    if (model.includes('12 Pro Max')) return 23;
    if (model.includes('12 Pro')) return 24;
    if (model.includes('12 mini')) return 25;
    if (model.includes('12') && !model.includes('mini') && !model.includes('Pro')) return 26;
    
    // iPhone 11 series
    if (model.includes('11 Pro Max')) return 27;
    if (model.includes('11 Pro')) return 28;
    if (model.includes('11') && !model.includes('Pro')) return 29;
    
    // iPhone X series
    if (model.includes('XS Max')) return 30;
    if (model.includes('XS') && !model.includes('Max')) return 31;
    if (model.includes('XR')) return 32;
    
    return 999; // Default for unknown models
  };

  // Format iPhone model name for display
  const formatiPhoneModel = (model: string): string => {
    // Replace "iPhone SE (2022)" with "iPhone SE 3 (2022)" for display
    if (model === 'iPhone SE (2022)') {
      return 'iPhone SE 3 (2022)';
    }
    // Replace "iPhone SE (2020)" with "iPhone SE 2 (2020)" for display
    if (model === 'iPhone SE (2020)') {
      return 'iPhone SE 2 (2020)';
    }
    return model;
  };

  // Get all devices for a brand, sorted by model (newest to oldest)
  const getBrandDevices = (brand: string): Device[] => {
    if (!data) return [];
    
    const smartphone = data.smartphones.find(s => s.brand === brand);
    if (!smartphone) return [];

    const allDevices: Device[] = [];
    smartphone.series.forEach(series => {
      allDevices.push(...series.devices);
    });

    // Custom sorting for iPhone models to match screenshot order
    if (brand === 'Apple') {
      return allDevices.sort((a, b) => {
        const priorityA = getDevicePriority(a.model);
        const priorityB = getDevicePriority(b.model);
        return priorityA - priorityB;
      }).map(device => ({
        ...device,
        model: formatiPhoneModel(device.model)
      }));
    }

    // For other brands, sort by number descending
    return allDevices.sort((a, b) => {
      const getModelNumber = (model: string): number => {
        const match = model.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      };
      
      const numA = getModelNumber(a.model);
      const numB = getModelNumber(b.model);
      
      if (numA !== numB) {
        return numB - numA;
      }
      
      return b.model.localeCompare(a.model, 'bg');
    });
  };

  // Get all brands for smartphones
  const smartphoneBrands = useMemo(() => {
    if (!data) return [];
    return data.smartphones.map(s => s.brand);
  }, [data]);

  // Get all brands for tablets
  const tabletBrands = useMemo(() => {
    return tabletsData.map(t => t.brand);
  }, []);

  // Get all devices for a tablet brand
  const getTabletBrandDevices = (brand: string): Device[] => {
    const tablet = tabletsData.find(t => t.brand === brand);
    if (!tablet) return [];

    const allDevices: Device[] = [];
    tablet.series.forEach(series => {
      allDevices.push(...series.devices);
    });

    return allDevices;
  };

  // Get all brands for laptops
  const laptopBrands = useMemo(() => {
    return laptopsData.map(l => l.brand);
  }, []);

  // Get all devices for a laptop brand
  const getLaptopBrandDevices = (brand: string): Device[] => {
    const laptop = laptopsData.find(l => l.brand === brand);
    if (!laptop) return [];

    const allDevices: Device[] = [];
    laptop.series.forEach(series => {
      allDevices.push(...series.devices);
    });

    return allDevices;
  };

  // Get all brands for smartwatches
  const smartwatchBrands = useMemo(() => {
    return smartwatchesData.map(s => s.brand);
  }, []);

  // Get all devices for a smartwatch brand
  const getSmartwatchBrandDevices = (brand: string): Device[] => {
    const smartwatch = smartwatchesData.find(s => s.brand === brand);
    if (!smartwatch) return [];

    const allDevices: Device[] = [];
    smartwatch.series.forEach(series => {
      allDevices.push(...series.devices);
    });

    return allDevices;
  };

  // Check if brand has China/Hong Kong/Macao note
  const hasChinaNote = (brand: string): boolean => {
    if (brand !== 'Apple') return false;
    const devices = getBrandDevices(brand);
    return devices.some(d => 
      d.notes && d.notes.toLowerCase().includes('mainland china')
    );
  };

  return (
    <div className={styles.deviceList}>
      {/* Category Navigation */}
      <div className={styles.categoryNav}>
        <button
          className={`${styles.categoryTab} ${activeCategory === 'smartphones' ? styles.active : ''}`}
          onClick={() => setActiveCategory('smartphones')}
        >
          Смартфони
        </button>
        <button
          className={`${styles.categoryTab} ${activeCategory === 'smartwatches' ? styles.active : ''}`}
          onClick={() => setActiveCategory('smartwatches')}
        >
          Смарт часовници
        </button>
        <button
          className={`${styles.categoryTab} ${activeCategory === 'tablets' ? styles.active : ''}`}
          onClick={() => setActiveCategory('tablets')}
        >
          Таблети
        </button>
        <button
          className={`${styles.categoryTab} ${activeCategory === 'laptops' ? styles.active : ''}`}
          onClick={() => setActiveCategory('laptops')}
        >
          Лаптопи
        </button>
      </div>

      {/* Content Area */}
      {activeCategory === 'smartphones' && (
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.icon}>
              <MdPhoneAndroid className={styles.iconSvg} />
            </div>
            <h2 className={styles.title}>Смартфони</h2>
          </div>
          
          <p className={styles.intro}>
            eSIM e съвместим с повечето iPhone устройства и много Android телефони:
          </p>

          {/* Brand Sections */}
          {smartphoneBrands.map(brand => {
            const devices = getBrandDevices(brand);
            const isExpanded = expandedBrands.has(brand);
            const showChinaNote = hasChinaNote(brand) && brand === 'Apple';

            return (
              <div key={brand} className={styles.brandSection}>
                <button
                  className={styles.brandHeader}
                  onClick={() => toggleBrand(brand)}
                  aria-expanded={isExpanded}
                >
                  <span className={styles.brandName}>{brand === 'Apple' ? 'iPhone' : brand}</span>
                  <span className={`${styles.caret} ${isExpanded ? styles.expanded : ''}`}>
                    ▼
                  </span>
                </button>

                <div className={`${styles.deviceListContent} ${isExpanded ? styles.expanded : ''}`}>
                  <ul className={styles.deviceList}>
                    {devices.map((device, index) => (
                      <li key={index} className={styles.deviceItem}>
                        {device.model}
                      </li>
                    ))}
                  </ul>

                  {showChinaNote && isExpanded && (
                    <div className={styles.infoBox}>
                      <span className={styles.infoIcon}>ℹ️</span>
                      <p className={styles.infoText}>
                        iPhone устройствата, продадени в континентален Китай, не поддържат eSIM, 
                        и само някои iPhone модели, продадени в Хонг Конг и Макао, поддържат eSIM. 
                        Ако сте закупили iPhone в някоя от тези страни, проверете дали вашият iPhone 
                        е съвместим с eSIM преди да инсталирате eSIM приложение.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tablets Content Area */}
      {activeCategory === 'tablets' && (
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.icon}>
              <MdTablet className={styles.iconSvg} />
            </div>
            <h2 className={styles.title}>Таблети</h2>
          </div>
          
          <p className={styles.intro}>
            Само няколко таблета поддържат eSIM. Трябва да търсите по-новите Apple iPad устройства, които предлагат клетъчни връзки, и само най-новите Samsung S9 модели имат тази функционалност.
          </p>

          {/* Brand Sections */}
          {tabletBrands.map(brand => {
            const devices = getTabletBrandDevices(brand);
            const isExpanded = expandedBrands.has(brand);

            return (
              <div key={brand} className={styles.brandSection}>
                <button
                  className={styles.brandHeader}
                  onClick={() => toggleBrand(brand)}
                  aria-expanded={isExpanded}
                >
                  <span className={styles.brandName}>{brand}</span>
                  <span className={`${styles.caret} ${isExpanded ? styles.expanded : ''}`}>
                    ▼
                  </span>
                </button>

                <div className={`${styles.deviceListContent} ${isExpanded ? styles.expanded : ''}`}>
                  <ul className={styles.deviceList}>
                    {devices.map((device, index) => (
                      <li key={index} className={styles.deviceItem}>
                        {device.model}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Laptops Content Area */}
      {activeCategory === 'laptops' && (
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.icon}>
              <MdLaptop className={styles.iconSvg} />
            </div>
            <h2 className={styles.title}>Лаптопи</h2>
          </div>
          
          <p className={styles.intro}>
            Доста модели лаптопи поддържат eSIM. Имайте предвид, че те трябва да работят с Windows 10 или Windows 11 операционна система.
          </p>

          {/* Brand Sections */}
          {laptopBrands.map(brand => {
            const devices = getLaptopBrandDevices(brand);
            const isExpanded = expandedBrands.has(brand);

            return (
              <div key={brand} className={styles.brandSection}>
                <button
                  className={styles.brandHeader}
                  onClick={() => toggleBrand(brand)}
                  aria-expanded={isExpanded}
                >
                  <span className={styles.brandName}>{brand}</span>
                  <span className={`${styles.caret} ${isExpanded ? styles.expanded : ''}`}>
                    ▼
                  </span>
                </button>

                <div className={`${styles.deviceListContent} ${isExpanded ? styles.expanded : ''}`}>
                  <ul className={styles.deviceList}>
                    {devices.map((device, index) => (
                      <li key={index} className={styles.deviceItem}>
                        {device.model}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Smartwatches Content Area */}
      {activeCategory === 'smartwatches' && (
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.icon}>
              <MdWatch className={styles.iconSvg} />
            </div>
            <h2 className={styles.title}>Смарт часовници</h2>
          </div>
          
          <p className={styles.intro}>
            Намерете всички смарт часовници, съвместими с eSIM, от Apple, Samsung и други марки тук:
          </p>

          {/* Brand Sections */}
          {smartwatchBrands.map(brand => {
            const devices = getSmartwatchBrandDevices(brand);
            const isExpanded = expandedBrands.has(brand);

            return (
              <div key={brand} className={styles.brandSection}>
                <button
                  className={styles.brandHeader}
                  onClick={() => toggleBrand(brand)}
                  aria-expanded={isExpanded}
                >
                  <span className={styles.brandName}>{brand}</span>
                  <span className={`${styles.caret} ${isExpanded ? styles.expanded : ''}`}>
                    ▼
                  </span>
                </button>

                <div className={`${styles.deviceListContent} ${isExpanded ? styles.expanded : ''}`}>
                  <ul className={styles.deviceList}>
                    {devices.map((device, index) => (
                      <li key={index} className={styles.deviceItem}>
                        {device.model}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Placeholder for other categories */}
      {activeCategory !== 'smartphones' && activeCategory !== 'tablets' && activeCategory !== 'laptops' && activeCategory !== 'smartwatches' && (
        <div className={styles.content}>
          <p className={styles.comingSoon}>
            Съдържанието скоро ще бъде добавено.
          </p>
        </div>
      )}
    </div>
  );
}

