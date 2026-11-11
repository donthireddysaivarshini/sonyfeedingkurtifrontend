/**
 * SONY COLLECTIONS - Indian States & Union Territories
 * 
 * Exhaustive official list of all 28 Indian States and 8 Union Territories (36 total).
 */

export interface RegionOption {
  code: string;
  name: string;
  type: 'State' | 'Union Territory';
}

export const INDIAN_STATES_AND_UTS: RegionOption[] = [
  // 28 States
  { code: 'AP', name: 'Andhra Pradesh', type: 'State' },
  { code: 'AR', name: 'Arunachal Pradesh', type: 'State' },
  { code: 'AS', name: 'Assam', type: 'State' },
  { code: 'BR', name: 'Bihar', type: 'State' },
  { code: 'CG', name: 'Chhattisgarh', type: 'State' },
  { code: 'GA', name: 'Goa', type: 'State' },
  { code: 'GJ', name: 'Gujarat', type: 'State' },
  { code: 'HR', name: 'Haryana', type: 'State' },
  { code: 'HP', name: 'Himachal Pradesh', type: 'State' },
  { code: 'JH', name: 'Jharkhand', type: 'State' },
  { code: 'KA', name: 'Karnataka', type: 'State' },
  { code: 'KL', name: 'Kerala', type: 'State' },
  { code: 'MP', name: 'Madhya Pradesh', type: 'State' },
  { code: 'MH', name: 'Maharashtra', type: 'State' },
  { code: 'MN', name: 'Manipur', type: 'State' },
  { code: 'ML', name: 'Meghalaya', type: 'State' },
  { code: 'MZ', name: 'Mizoram', type: 'State' },
  { code: 'NL', name: 'Nagaland', type: 'State' },
  { code: 'OD', name: 'Odisha', type: 'State' },
  { code: 'PB', name: 'Punjab', type: 'State' },
  { code: 'RJ', name: 'Rajasthan', type: 'State' },
  { code: 'SK', name: 'Sikkim', type: 'State' },
  { code: 'TN', name: 'Tamil Nadu', type: 'State' },
  { code: 'TG', name: 'Telangana', type: 'State' },
  { code: 'TR', name: 'Tripura', type: 'State' },
  { code: 'UP', name: 'Uttar Pradesh', type: 'State' },
  { code: 'UK', name: 'Uttarakhand', type: 'State' },
  { code: 'WB', name: 'West Bengal', type: 'State' },

  // 8 Union Territories
  { code: 'AN', name: 'Andaman and Nicobar Islands', type: 'Union Territory' },
  { code: 'CH', name: 'Chandigarh', type: 'Union Territory' },
  { code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu', type: 'Union Territory' },
  { code: 'DL', name: 'Delhi (NCT)', type: 'Union Territory' },
  { code: 'JK', name: 'Jammu and Kashmir', type: 'Union Territory' },
  { code: 'LA', name: 'Ladakh', type: 'Union Territory' },
  { code: 'LD', name: 'Lakshadweep', type: 'Union Territory' },
  { code: 'PY', name: 'Puducherry', type: 'Union Territory' },
];

export const ALL_INDIAN_REGIONS: string[] = INDIAN_STATES_AND_UTS.map((r) => r.name);

