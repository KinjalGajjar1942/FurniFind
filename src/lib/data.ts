import type { Furniture } from './types';
import placeholderImagesData from './placeholder-images.json';

const { placeholderImages: PlaceHolderImages } = placeholderImagesData;

const furnitureData: Furniture[] = [
  {
    id: '1',
    name: 'Plush Velvet Sofa',
    description: 'Experience ultimate comfort with this luxurious green velvet sofa. Its deep cushions and soft upholstery make it the perfect centerpiece for any modern living room.',
    images: [
        { url: PlaceHolderImages[0].imageUrl, hint: PlaceHolderImages[0].imageHint },
        { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop', hint: 'green sofa side view'},
        { url: 'https://images.unsplash.com/photo-1608304224888-22345d064c2d?q=80&w=1974&auto=format&fit=crop', hint: 'green sofa detail'},
    ],
    category: 'Sofas',
  },
  {
    id: '2',
    name: 'Solid Oak Dining Table',
    description: 'Host memorable dinners with this beautiful solid oak dining table. Seats up to six people comfortably and is built to last for generations.',
    images: [{ url: PlaceHolderImages[1].imageUrl, hint: PlaceHolderImages[1].imageHint }],
    category: 'Kitchen',
  },
  {
    id: '3',
    name: 'Classic Leather Armchair',
    description: 'A timeless piece, this classic brown leather armchair adds a touch of sophistication to any space. Perfect for reading or relaxing.',
    images: [{ url: PlaceHolderImages[2].imageUrl, hint: PlaceHolderImages[2].imageHint }],
    category: 'Sofas',
  },
  {
    id: '4',
    name: 'Minimalist Bookshelf',
    description: 'Organize your favorite books and decor on this sleek, minimalist bookshelf. Its dark wood finish complements any modern interior design.',
    images: [{ url: PlaceHolderImages[3].imageUrl, hint: PlaceHolderImages[3].imageHint }],
    category: 'Bedroom',
  },
  {
    id: '5',
    name: 'Modern Coffee Table',
    description: 'This modern coffee table features a tempered glass top and a stylish metal frame, offering a light and airy feel to your living area.',
    images: [{ url: PlaceHolderImages[4].imageUrl, hint: PlaceHolderImages[4].imageHint }],
    category: 'Sofas',
  },
  {
    id: '6',
    name: 'Rustic King Bed Frame',
    description: 'Bring a touch of nature indoors with this rustic king-size bed frame. Made from reclaimed wood, it provides a sturdy and stylish foundation for a restful night.',
    images: [{ url: PlaceHolderImages[5].imageUrl, hint: PlaceHolderImages[5].imageHint }],
    category: 'Bedroom',
  },
];

export const getFurnitureItems = (): Furniture[] => {
  return furnitureData;
};

export const getFurnitureItemById = (id: string): Furniture | undefined => {
  return furnitureData.find((item) => item.id === id);
};

export const getFurnitureItemsByCategory = (category: string): Furniture[] => {
  return furnitureData.filter((item) => item.category.toLowerCase() === category.toLowerCase());
};

export const getCategories = (): { name: string, imageUrl: string, imageHint: string }[] => {
  const categoriesMap = new Map<string, { imageUrl: string; imageHint: string }>();
  furnitureData.forEach((item) => {
    if (!categoriesMap.has(item.category)) {
      categoriesMap.set(item.category, { imageUrl: item.images[0].url, imageHint: item.images[0].hint });
    }
  });

  return Array.from(categoriesMap.entries()).map(([name, { imageUrl, imageHint }]) => ({
    name,
    imageUrl,
    imageHint,
  }));
};
