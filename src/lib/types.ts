export type Game = {
  id: string;
  title: string;
  genre: string;
  cover_url: string | null;
  active: boolean;
};

export type Pricing = {
  id: string;
  name: string;
  duration: string;
  players: string;
  price: number;
  features: string[];
  popular: boolean;
  active: boolean;
};

export type Promotion = {
  id: string;
  title: string;
  description: string;
  discount: string | null;
  expires_at: string | null;
  active: boolean;
};

export type GalleryItem = {
  id: string;
  url: string;
  caption: string | null;
  sort_order: number;
};

export type Contact = {
  id: string;
  type: string;
  value: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  prize: string | null;
  active: boolean;
};

export type Setting = {
  key: string;
  value: string;
};
