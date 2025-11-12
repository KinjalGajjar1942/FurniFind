import type { Furniture } from './types';
import placeholderImagesData from './placeholder-images.json';

const { placeholderImages: PlaceHolderImages } = placeholderImagesData;

const furnitureData: Furniture[] = [
  {
    id: '1',
    name: 'Plush Velvet Sofa',
    description: 'Experience ultimate comfort with this luxurious green velvet sofa. Its deep cushions and soft upholstery make it the perfect centerpiece for any modern living room.',
    price: 899.99,
    imageUrl: PlaceHolderImages[0].imageUrl,
    imageHint: PlaceHolderImages[0].imageHint,
    sellerContact: 'seller1@example.com',
    category: 'Sofas',
  },
  {
    id: '2',
    name: 'Solid Oak Dining Table',
    description: 'Host memorable dinners with this beautiful solid oak dining table. Seats up to six people comfortably and is built to last for generations.',
    price: 649.00,
    imageUrl: PlaceHolderImages[1].imageUrl,
    imageHint: PlaceHolderImages[1].imageHint,
    sellerContact: 'seller2@example.com',
    category: 'Kitchen',
  },
  {
    id: '3',
    name: 'Classic Leather Armchair',
    description: 'A timeless piece, this classic brown leather armchair adds a touch of sophistication to any space. Perfect for reading or relaxing.',
    price: 450.50,
    imageUrl: PlaceHolderImages[2].imageUrl,
    imageHint: PlaceHolderImages[2].imageHint,
    sellerContact: 'seller3@example.com',
    category: 'Sofas',
  },
  {
    id: '4',
    name: 'Minimalist Bookshelf',
    description: 'Organize your favorite books and decor on this sleek, minimalist bookshelf. Its dark wood finish complements any modern interior design.',
    price: 299.00,
    imageUrl: PlaceHolderImages[3].imageUrl,
    imageHint: PlaceHolderImages[3].imageHint,
    sellerContact: 'seller4@example.com',
    category: 'Bedroom',
  },
  {
    id: '5',
    name: 'Modern Coffee Table',
    description: 'This modern coffee table features a tempered glass top and a stylish metal frame, offering a light and airy feel to your living area.',
    price: 199.99,
    imageUrl: PlaceHolderImages[4].imageUrl,
    imageHint: PlaceHolderImages[4].imageHint,
    sellerContact: 'seller5@example.com',
    category: 'Sofas',
  },
  {
    id: '6',
    name: 'Rustic King Bed Frame',
    description: 'Bring a touch of nature indoors with this rustic king-size bed frame. Made from reclaimed wood, it provides a sturdy and stylish foundation for a restful night.',
    price: 799.00,
    imageUrl: PlaceHolderImages[5].imageUrl,
    imageHint: PlaceHolderImages[5].imageHint,
    sellerContact: 'seller6@example.com',
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

export const getCategories = (): string[] => {
  const categories = furnitureData.map((item) => item.category);
  return [...new Set(categories)];
};
