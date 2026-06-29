-- ============================================================
-- Love in Game — SQL Migration
-- Paste this entire block in Supabase → SQL Editor → Run
-- ============================================================

-- Menu categories (Пицца, Завтраки, Супы, Салаты, Горячее)
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label text NOT NULL,
  photo_url text,
  sort_order int DEFAULT 0,
  active boolean DEFAULT true
);

-- Menu items
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_key text NOT NULL,
  name text NOT NULL,
  price text NOT NULL,
  sort_order int DEFAULT 0,
  active boolean DEFAULT true
);

-- FAQ
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int DEFAULT 0,
  active boolean DEFAULT true
);

-- Seed categories
INSERT INTO menu_categories (key, label, photo_url, sort_order) VALUES
('pizza',     'Пицца',    'https://yppsswknejekkjhigouv.supabase.co/storage/v1/object/public/photos/menu-pizza.jpg',     1),
('breakfast', 'Завтраки', 'https://yppsswknejekkjhigouv.supabase.co/storage/v1/object/public/photos/menu-breakfast.jpg', 2),
('soups',     'Супы',     'https://yppsswknejekkjhigouv.supabase.co/storage/v1/object/public/photos/menu-soups.jpg',     3),
('salads',    'Салаты',   'https://yppsswknejekkjhigouv.supabase.co/storage/v1/object/public/photos/menu-salads.jpg',    4),
('hot',       'Горячее',  'https://yppsswknejekkjhigouv.supabase.co/storage/v1/object/public/photos/menu-hot.jpg',       5)
ON CONFLICT (key) DO NOTHING;

-- Seed items
INSERT INTO menu_items (category_key, name, price, sort_order) VALUES
('pizza','Маргарита','2 190 ₸',1),('pizza','Пепперони','2 390 ₸',2),
('pizza','Курица с грибами','2 590 ₸',3),('pizza','Пицца 4 сезона','2 690 ₸',4),
('pizza','Хачапури по-аджарски','2 190 ₸',5),
('breakfast','Драники по-белорусски','2 090 ₸',1),
('breakfast','Английский завтрак','2 090 ₸',2),('breakfast','Сладкое утро','2 090 ₸',3),
('soups','Борщ','1 490 ₸',1),('soups','Окрошка','1 490 ₸',2),
('soups','Солянка','1 590 ₸',3),('soups','Мини-хинкали','1 690 ₸',4),('soups','Шорпа','1 990 ₸',5),
('salads','Оливье','1 290 ₸',1),('salads','Цезарь','2 090 ₸',2),
('salads','Греческий','2 090 ₸',3),('salads','Хрустящие баклажаны','2 290 ₸',4),
('hot','Вареники','1 390 ₸',1),('hot','Пельмени','1 790 ₸',2),
('hot','Манты','2 390 ₸',3),('hot','Бефстроганов','2 390 ₸',4),('hot','Фетучини','2 290 ₸',5);

-- Seed FAQ
INSERT INTO faq_items (question, answer, sort_order) VALUES
('Нужно ли бронировать заранее?','Рекомендуем бронировать через WhatsApp, особенно в выходные. В будни часто есть места без брони.',1),
('Сколько человек может играть?','На одну PS5: 1–4 человека. Тариф VIP: 2 консоли, до 6 игроков.',2),
('Можно ли прийти с ребёнком?','Да, дети до 12 лет бесплатно со взрослым. Рекомендуем тариф на 2–4 часа.',3),
('Как проходит бронирование?','Пишите в WhatsApp — выбираете дату, время и тариф. Подтверждаем за минуты. Предоплаты нет.',4),
('Какие игры доступны?','Более 100 игр на PS5: FIFA, God of War, Spider-Man, GTA V, Tekken, NBA 2K и другие.',5),
('Можно принести свою еду?','У нас собственное меню. Безалкогольные напитки в закрытой таре разрешены.',6),
('Есть ли парковка?','Рядом бесплатная парковка. В час пик приезжайте немного раньше.',7),
('Делаете корпоративы и дни рождения?','Да! Организуем любые мероприятия. Свяжитесь для индивидуального предложения.',8);

-- Public read access
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items       ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='menu_categories' AND policyname='public read') THEN
    CREATE POLICY "public read" ON menu_categories FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='menu_items' AND policyname='public read') THEN
    CREATE POLICY "public read" ON menu_items FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='faq_items' AND policyname='public read') THEN
    CREATE POLICY "public read" ON faq_items FOR SELECT USING (true);
  END IF;
END $$;