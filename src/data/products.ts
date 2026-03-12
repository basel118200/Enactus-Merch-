export interface Product {
  slug: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  description: string;
  care: string;
}

export const products: Product[] = [
  {
    slug: "enactus-cairo-crewneck",
    name: "Enactus Cairo Crewneck",
    price: 550,
    category: "Winter Collection",
    images: [
      "/products/crewneck.jpg.jpeg",
      "/products/crewneck.jpg (2).jpeg",
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Classic heavyweight crewneck with 'MIGHTY CAIRO' design on back. Premium fleece-lined cotton for comfort.",
    care: "Machine wash cold inside out. Tumble dry low.",
  },
  {
    slug: "enactus-cairo-zip-hoodie",
    name: "Enactus Cairo Zip Hoodie",
    price: 570,
    category: "Winter Collection",
    images: [
      "/products/zip-hoodie.jpg.jpeg",
      "/products/zip-hoodie.jpg (2).jpeg",
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Exclusive zip-up hoodie featuring 'ENACTUS CAIRO 2026' front print and large star logo on back.",
    care: "Machine wash cold. Hang dry recommended to preserve print.",
  },
];

export const categories = ["All", "Winter Collection", "Summer Collection"];
