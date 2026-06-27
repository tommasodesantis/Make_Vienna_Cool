export interface Address {
  street_address: string;
  postal_code: string;
  city: string;
  country: string;
  district: string;
  formatted: string;
}

export interface OpeningHour {
  days: string[];
  open: string;
  close: string;
  valid_from: string | null;
  valid_to: string | null;
  note: string | null;
  closes_next_day: boolean;
}

export interface CoolingInfo {
  type: string;
  ac_confirmed: boolean | null;
  note: string | null;
}

export interface RedditRecommendation {
  recommended: boolean;
  scope: string;
  recommendation_date: string;
  source_url: string;
  note: string | null;
}

export interface Place {
  id: string;
  name: string;
  address: Address;
  opening_hours: OpeningHour[];
  timezone: string;
  cooling: CoolingInfo;
  coole_zonen_list: boolean;
  ticket_required_to_enter: boolean;
  consumption_required: boolean;
  consumption_mandatory: boolean;
  sitting_present: boolean | null;
  free_wifi_present: boolean | null;
  tables_or_desks_present: boolean | null;
  drinks_can_be_purchased: boolean | null;
  food_can_be_purchased: boolean | null;
  home_food_and_drinks_allowed: boolean | null;
  other_amenities: string[];
  barrier_free: boolean | null;
  sockets_available: boolean | null;
  reddit_recommendation: RedditRecommendation | null;
  sources: string[];
  verification_confidence: string;
  notes: string | null;
  // Pre-mapped high-quality coordinates
  lat: number;
  lng: number;
}

export interface ExcludedSuggestion {
  name: string;
  reason: string;
  reddit_source_url: string;
}
