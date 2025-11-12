export interface FurnitureImage {
  url: string;
  hint: string;
}

export interface Furniture {
  id: string;
  name: string;
  description: string;
  images: FurnitureImage[];
  sellerContact: string;
  category: string;
}
