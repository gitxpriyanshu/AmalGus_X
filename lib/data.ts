// Glass type to recommended thickness mapping
export const glassThicknessMap: Record<string, string> = {
  'Clear Float': '5mm',
  'Toughened': '8mm',
  'Laminated': '10mm',
  'DGU / IGU': '6+12+6mm',
  'Frosted': '6mm',
  'Reflective': '6mm',
  'Low-E Glass': '6mm',
  'Back-Painted': '8mm',
}

// All glass types for dropdowns
export const glassTypes = [
  'Clear Float',
  'Toughened',
  'Laminated',
  'DGU / IGU',
  'Frosted',
  'Reflective',
  'Low-E Glass',
  'Back-Painted',
]

// All applications for filter
export const applications = [
  'Windows',
  'Shower Enclosure',
  'Railing',
  'Facade',
  'Partition',
  'Kitchen Backsplash',
  'Safety Glazing',
  'Curtain Wall',
  'Balcony',
  'Skylight',
  'Interior Decor',
]

// Customer roles
export const customerRoles = [
  {
    id: 'homeowner',
    label: 'Homeowner',
    description: 'Renovating or building your home',
    icon: 'Home',
    color: 'blue',
  },
  {
    id: 'architect',
    label: 'Architect',
    description: 'Specifying glass for projects',
    icon: 'Ruler',
    color: 'purple',
  },
  {
    id: 'builder',
    label: 'Builder / Developer',
    description: 'Bulk procurement for projects',
    icon: 'Building2',
    color: 'amber',
  },
  {
    id: 'dealer',
    label: 'Glass Dealer',
    description: 'Trade buying and reselling',
    icon: 'Store',
    color: 'green',
  },
]

// Role-specific content
export const roleContent: Record<string, { headline: string; subtext: string; ctaLabel: string }> = {
  homeowner: {
    headline: 'Glass for Your Home',
    subtext: 'Find the right glass for showers, windows, railings, and kitchen — with trusted local installers.',
    ctaLabel: 'Find Glass for My Home',
  },
  architect: {
    headline: 'Technical Specifications & Samples',
    subtext: 'Access detailed specs, certifications, U-values, and solar factor data for project specifications.',
    ctaLabel: 'Browse Technical Catalog',
  },
  builder: {
    headline: 'Bulk Pricing & Multi-Site Delivery',
    subtext: 'Get factory-direct pricing, compare multiple vendors, and manage glass across all your project sites.',
    ctaLabel: 'Get Bulk Quote',
  },
  dealer: {
    headline: 'Trade Pricing & Daily Rates',
    subtext: "Access today's factory rates, bulk discounts, and direct supply from verified manufacturers.",
    ctaLabel: 'View Trade Rates',
  },
}

// AI match example queries
export const aiExampleQueries = [
  'I need glass for my bathroom shower',
  'Soundproof glass for my office cabin',
  'Glass railing for my balcony on 15th floor',
  'Energy efficient glass for south-facing facade',
  'Decorative glass for kitchen backsplash',
  'Privacy glass for conference room partition',
]

// Stats for homepage
export const platformStats = [
  { value: '₹150B+', label: 'Market Size' },
  { value: '52+', label: 'Customer Types' },
  { value: '15+', label: 'Glass Types' },
  { value: '25 Yrs', label: 'Industry Expertise' },
]

// Price calculation utility
export function calculateQuote(
  widthMm: number,
  heightMm: number,
  quantity: number,
  pricePerSqft: number
): { areaSqft: number; basePrice: number; gst: number; total: number } {
  const areaSqft = (widthMm / 304.8) * (heightMm / 304.8)
  const basePrice = areaSqft * pricePerSqft * quantity
  const gst = basePrice * 0.18
  const total = basePrice + gst
  return {
    areaSqft: Math.round(areaSqft * 100) / 100,
    basePrice: Math.round(basePrice),
    gst: Math.round(gst),
    total: Math.round(total),
  }
}
