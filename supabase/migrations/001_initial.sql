-- Love in Game — initial schema

create extension if not exists "uuid-ossp";

-- Games library
create table if not exists games (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  genre text not null default 'Другое',
  cover_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Pricing plans
create table if not exists pricing (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  duration text not null,
  players text not null,
  price integer not null,
  features text[] not null default '{}',
  popular boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Promotions / акции
create table if not exists promotions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  discount text,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Photo gallery
create table if not exists gallery (
  id uuid primary key default uuid_generate_v4(),
  url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Contacts (whatsapp, phone, instagram, address, hours)
create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  type text not null unique,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Tournaments & events
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  event_date timestamptz not null,
  prize text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Global settings (key-value)
create table if not exists settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Enable RLS (read-only public access, writes via service role)
alter table games enable row level security;
alter table pricing enable row level security;
alter table promotions enable row level security;
alter table gallery enable row level security;
alter table contacts enable row level security;
alter table events enable row level security;
alter table settings enable row level security;

create policy "public read games" on games for select using (true);
create policy "public read pricing" on pricing for select using (true);
create policy "public read promotions" on promotions for select using (true);
create policy "public read gallery" on gallery for select using (true);
create policy "public read contacts" on contacts for select using (true);
create policy "public read events" on events for select using (true);
create policy "public read settings" on settings for select using (true);

-- Seed data
insert into games (title, genre) values
  ('FIFA 25', 'Спорт'),
  ('God of War: Ragnarök', 'Экшен'),
  ('Spider-Man 2', 'Экшен'),
  ('Mortal Kombat 1', 'Файтинг'),
  ('EA Sports FC 25', 'Спорт'),
  ('Tekken 8', 'Файтинг'),
  ('NBA 2K25', 'Спорт'),
  ('Call of Duty: BO6', 'Шутер'),
  ('Gran Turismo 7', 'Гонки'),
  ('Hogwarts Legacy', 'RPG'),
  ('UFC 5', 'Спорт'),
  ('GTA V', 'Экшен');

insert into pricing (name, duration, players, price, features, popular) values
  ('Стандарт', '1 час', '1–2 игрока', 2000, ARRAY['1 консоль PlayStation 5', '100+ игр на выбор', 'Комфортная зона'], false),
  ('Комфорт', '2 часа', '1–2 игрока', 3500, ARRAY['1 консоль PlayStation 5', '100+ игр на выбор', 'Напиток в подарок', 'Экономия 12%'], true),
  ('Вечерний', '3 часа', '1–4 игрока', 5000, ARRAY['1 консоль PlayStation 5', '100+ игр на выбор', '2 напитка в подарок', 'Экономия 17%'], false),
  ('VIP', '4 часа', '1–6 игроков', 8000, ARRAY['2 консоли PlayStation 5', 'Все игры + DLC', 'Снэки и напитки', 'Отдельная зона'], false);

insert into contacts (type, value) values
  ('whatsapp', '77000000000'),
  ('phone', '+7 700 000 00 00'),
  ('instagram', 'loveingame'),
  ('address', 'г. Алматы, ул. Примерная, 123'),
  ('hours', 'Ежедневно: 10:00 – 02:00');

insert into settings (key, value) values
  ('whatsapp_number', '77000000000'),
  ('site_title', 'Love in Game — Gaming Café Almaty'),
  ('booking_message', 'Хочу забронировать сеанс');
