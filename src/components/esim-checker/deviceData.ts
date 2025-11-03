// Shared device data for compatibility checker

export interface Device {
  model: string;
  notes: string | null;
}

export interface Series {
  series_name: string;
  devices: Device[];
}

export interface DeviceBrand {
  brand: string;
  series: Series[];
}

// Import tablets, laptops, and smartwatches data
// These will be imported from DeviceList or defined here
export const tabletsData: DeviceBrand[] = [
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

export const laptopsData: DeviceBrand[] = [
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

export const smartwatchesData: DeviceBrand[] = [
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

