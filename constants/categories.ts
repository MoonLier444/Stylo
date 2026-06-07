import type { GarmentCategory } from '../types/garment'

export const GARMENT_CATEGORIES: {
  value: GarmentCategory
  label: string
  icon: string
  subcategories: { value: string; label: string }[]
}[] = [
  {
    value: 'top',
    label: 'Parte superior',
    icon: '👕',
    subcategories: [
      { value: 't-shirt', label: 'Camiseta' },
      { value: 'shirt', label: 'Camisa' },
      { value: 'blouse', label: 'Blusa' },
      { value: 'sweater', label: 'Jersey' },
      { value: 'hoodie', label: 'Sudadera' },
    ],
  },
  {
    value: 'bottom',
    label: 'Parte inferior',
    icon: '👖',
    subcategories: [
      { value: 'jeans', label: 'Vaqueros' },
      { value: 'trousers', label: 'Pantalón' },
      { value: 'shorts', label: 'Shorts' },
      { value: 'skirt', label: 'Falda' },
    ],
  },
  {
    value: 'outerwear',
    label: 'Exterior',
    icon: '🧥',
    subcategories: [
      { value: 'jacket', label: 'Chaqueta' },
      { value: 'coat', label: 'Abrigo' },
      { value: 'blazer', label: 'Blazer' },
    ],
  },
  {
    value: 'dress',
    label: 'Vestido',
    icon: '👗',
    subcategories: [{ value: 'dress', label: 'Vestido' }],
  },
  {
    value: 'footwear',
    label: 'Calzado',
    icon: '👟',
    subcategories: [
      { value: 'sneakers', label: 'Zapatillas' },
      { value: 'boots', label: 'Botas' },
      { value: 'loafers', label: 'Mocasines' },
      { value: 'heels', label: 'Tacones' },
      { value: 'sandals', label: 'Sandalias' },
    ],
  },
  {
    value: 'accessory',
    label: 'Accesorio',
    icon: '👜',
    subcategories: [
      { value: 'bag', label: 'Bolso' },
      { value: 'belt', label: 'Cinturón' },
      { value: 'hat', label: 'Sombrero' },
      { value: 'scarf', label: 'Bufanda' },
      { value: 'sunglasses', label: 'Gafas de sol' },
      { value: 'watch', label: 'Reloj' },
    ],
  },
  {
    value: 'suit',
    label: 'Traje',
    icon: '🤵',
    subcategories: [{ value: 'suit', label: 'Traje' }],
  },
  {
    value: 'activewear',
    label: 'Deportivo',
    icon: '🏃',
    subcategories: [],
  },
]

export const CATEGORY_FILTER_OPTIONS = [
  { value: 'all', label: 'Todo' },
  ...GARMENT_CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
]

export const COLOR_OPTIONS = [
  { value: 'black', label: 'Negro', hex: '#0A0A0A' },
  { value: 'white', label: 'Blanco', hex: '#FFFFFF' },
  { value: 'gray', label: 'Gris', hex: '#737373' },
  { value: 'navy', label: 'Azul marino', hex: '#1E3A5F' },
  { value: 'blue', label: 'Azul', hex: '#2563EB' },
  { value: 'lightblue', label: 'Azul claro', hex: '#93C5FD' },
  { value: 'green', label: 'Verde', hex: '#16A34A' },
  { value: 'khaki', label: 'Caqui', hex: '#A0845C' },
  { value: 'beige', label: 'Beige', hex: '#D4B896' },
  { value: 'cream', label: 'Crema', hex: '#F5F0E8' },
  { value: 'brown', label: 'Marrón', hex: '#78350F' },
  { value: 'red', label: 'Rojo', hex: '#DC2626' },
  { value: 'burgundy', label: 'Burdeos', hex: '#7F1D1D' },
  { value: 'pink', label: 'Rosa', hex: '#EC4899' },
  { value: 'orange', label: 'Naranja', hex: '#EA580C' },
  { value: 'yellow', label: 'Amarillo', hex: '#CA8A04' },
  { value: 'purple', label: 'Morado', hex: '#7C3AED' },
]
