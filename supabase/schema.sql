-- =====================
-- SCHEMA
-- =====================

CREATE TABLE glass_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  glass_type TEXT NOT NULL,
  thickness TEXT NOT NULL,
  process TEXT NOT NULL,
  application TEXT[] NOT NULL,
  price_min NUMERIC NOT NULL,
  price_max NUMERIC NOT NULL,
  unit TEXT DEFAULT 'sq.ft',
  description TEXT,
  image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  rating NUMERIC DEFAULT 4.5,
  delivery_days INT DEFAULT 5,
  verified BOOLEAN DEFAULT true
);

CREATE TABLE vendor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES glass_products(id),
  vendor_id UUID REFERENCES vendors(id),
  price_per_sqft NUMERIC NOT NULL,
  min_order_sqft NUMERIC DEFAULT 10,
  delivery_days INT
);

CREATE TABLE daily_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  glass_type TEXT NOT NULL,
  thickness TEXT NOT NULL,
  rate_date DATE DEFAULT CURRENT_DATE,
  price_min NUMERIC NOT NULL,
  price_max NUMERIC NOT NULL,
  unit TEXT DEFAULT 'sq.ft',
  change_pct NUMERIC DEFAULT 0
);

CREATE TABLE allied_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_range TEXT,
  image_url TEXT,
  related_glass_types TEXT[]
);

CREATE TABLE service_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  city TEXT NOT NULL,
  rating NUMERIC DEFAULT 4.5,
  reviews_count INT DEFAULT 0,
  price_range TEXT,
  verified BOOLEAN DEFAULT true
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'homeowner',
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  glass_type TEXT NOT NULL,
  thickness TEXT,
  width_mm NUMERIC NOT NULL,
  height_mm NUMERIC NOT NULL,
  quantity INT DEFAULT 1,
  estimated_price NUMERIC,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- SEED DATA
-- =====================

INSERT INTO glass_products (name, glass_type, thickness, process, application, price_min, price_max, description, image_url, tags) VALUES
('Clear Float Glass', 'Clear Float', '5mm', 'Plain', ARRAY['Windows','General Glazing','Doors'], 45, 60, 'Standard clear float glass for windows and general glazing applications. High optical clarity, suitable for residential and commercial windows.', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600', ARRAY['basic','clear','window','affordable']),
('Toughened Safety Glass', 'Toughened', '8mm', 'Tempered', ARRAY['Shower Enclosure','Safety Glazing','Glass Doors','Partitions'], 120, 160, 'Heat-treated toughened glass that is 4-5x stronger than standard glass. Breaks into small safe fragments — mandatory for wet areas and safety-critical installations.', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600', ARRAY['safety','shower','tempered','strong']),
('Laminated Safety Glass', 'Laminated', '10mm', 'PVB Laminated', ARRAY['Railing','Skylight','Balcony','Acoustic Partition'], 180, 250, 'Two glass layers bonded with PVB interlayer. Holds together when shattered — critical for railings at height, acoustic insulation, and overhead glazing.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', ARRAY['railing','laminated','acoustic','safety','pvb']),
('DGU Insulated Glass Unit', 'DGU / IGU', '6+12+6mm', 'Insulated', ARRAY['Facade','Curtain Wall','Commercial Building','Energy Efficient Windows'], 350, 500, 'Double glazing unit with 12mm air/argon spacer. Superior thermal and acoustic insulation for facades, curtain walls, and commercial buildings with energy codes.', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600', ARRAY['DGU','IGU','insulated','facade','energy','curtain wall']),
('Frosted Acid Etched Glass', 'Frosted', '6mm', 'Acid Etched', ARRAY['Partition','Privacy','Bathroom','Office Cabin'], 85, 110, 'Acid etched surface creates uniform frosted appearance. Allows light transmission while providing privacy — ideal for office partitions and bathroom applications.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600', ARRAY['frosted','privacy','partition','office','bathroom']),
('Reflective Solar Control Glass', 'Reflective', '6mm', 'Coated', ARRAY['Exterior Facade','Commercial Building','Solar Control'], 100, 140, 'Metallic coating reflects solar radiation and reduces heat gain. Gives buildings their distinctive mirrored appearance while controlling solar heat.', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600', ARRAY['reflective','facade','solar','coated','commercial']),
('Low-E Energy Glass', 'Low-E Glass', '6mm', 'Soft Coat', ARRAY['Energy Efficient Facade','South-Facing Window','Green Building'], 200, 300, 'Low emissivity soft coat reduces heat transfer while allowing light. Best choice for south and west facing windows, LEED-certified buildings, and energy-code compliance.', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600', ARRAY['low-e','energy','green','LEED','thermal']),
('Back-Painted Lacquered Glass', 'Back-Painted', '8mm', 'Lacquered', ARRAY['Kitchen Backsplash','Interior Decor','Feature Wall'], 150, 220, 'Painted on the reverse side for vibrant colors and sleek surface. Popular for kitchen backsplashes, feature walls, and high-end interior design applications.', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', ARRAY['colored','kitchen','decorative','painted','interior']);

INSERT INTO vendors (name, city, rating, delivery_days, verified) VALUES
('GlassCo Mumbai', 'Mumbai', 4.8, 3, true),
('ClearView Delhi', 'Delhi', 4.5, 5, true),
('ShineGlass Pune', 'Pune', 4.6, 4, true);

INSERT INTO vendor_products (product_id, vendor_id, price_per_sqft, min_order_sqft, delivery_days)
SELECT gp.id, v.id,
  CASE v.name
    WHEN 'GlassCo Mumbai' THEN gp.price_min + 5
    WHEN 'ClearView Delhi' THEN gp.price_min + 10
    WHEN 'ShineGlass Pune' THEN gp.price_min
  END,
  10,
  CASE v.name
    WHEN 'GlassCo Mumbai' THEN 3
    WHEN 'ClearView Delhi' THEN 5
    WHEN 'ShineGlass Pune' THEN 4
  END
FROM glass_products gp CROSS JOIN vendors v;

INSERT INTO daily_rates (glass_type, thickness, price_min, price_max, change_pct) VALUES
('Clear Float', '5mm', 45, 60, 1.2),
('Toughened', '8mm', 120, 160, -0.8),
('Laminated', '10mm', 180, 250, 2.1),
('DGU / IGU', '6+12+6mm', 350, 500, 0.5),
('Frosted', '6mm', 85, 110, -1.5),
('Reflective', '6mm', 100, 140, 3.2),
('Low-E Glass', '6mm', 200, 300, 0.0),
('Back-Painted', '8mm', 150, 220, 1.8);

INSERT INTO allied_products (category, name, description, price_range, related_glass_types) VALUES
('Hardware & Fittings', 'Spider Fittings (4-Point)', 'Stainless steel point fixings for structural glass facades and railings', '₹800–2,500/piece', ARRAY['Laminated','DGU / IGU']),
('Hardware & Fittings', 'Patch Fittings Set', 'Floor and top patch fittings for frameless glass doors', '₹1,200–3,500/set', ARRAY['Toughened']),
('Hardware & Fittings', 'Glass Door Hinges (SS)', 'Heavy duty stainless steel hinges for toughened glass doors', '₹600–1,800/pair', ARRAY['Toughened','Clear Float']),
('Silicones & Sealants', 'Structural Silicone (Dow)', 'High-performance structural silicone for facade and curtain wall bonding', '₹450–800/cartridge', ARRAY['DGU / IGU','Reflective','Low-E Glass']),
('Silicones & Sealants', 'Sanitary Silicone', 'Mold-resistant silicone for shower enclosures and wet areas', '₹180–350/cartridge', ARRAY['Toughened','Frosted']),
('Doors & Windows', 'UPVC Casement Window Frame', 'Energy efficient UPVC frames for residential windows', '₹320–480/sq.ft', ARRAY['Clear Float','Low-E Glass']),
('Doors & Windows', 'Aluminium Slim Frame System', 'Slim section aluminium for modern minimalist facades', '₹450–750/sq.ft', ARRAY['DGU / IGU','Low-E Glass']),
('Shower Systems', 'Frameless Shower Enclosure Hardware', 'Complete hardware kit for frameless shower cubicle', '₹8,500–18,000/set', ARRAY['Toughened']),
('Railing Systems', 'U-Channel Base Clamp', 'Stainless steel U-channel for glass balcony railing installation', '₹280–520/rft', ARRAY['Laminated','Toughened']);

INSERT INTO service_partners (name, service_type, city, rating, reviews_count, price_range, verified) VALUES
('GlassFit Pro', 'Installation', 'Mumbai', 4.9, 142, '₹25–45/sq.ft', true),
('PrecisionMeasure', 'Measurement', 'Mumbai', 4.7, 89, '₹500–1,200/visit', true),
('SafeGlaze Installers', 'Installation', 'Pune', 4.6, 67, '₹20–40/sq.ft', true),
('SiteInspect Delhi', 'Site Visit', 'Delhi', 4.8, 103, '₹800–2,000/visit', true),
('GlassCare AMC', 'AMC', 'Mumbai', 4.5, 54, '₹2,500–8,000/year', true),
('QuickFit Glass', 'Installation', 'Delhi', 4.4, 78, '₹22–38/sq.ft', true);
