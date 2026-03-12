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
    price: 470,
    category: "Winter Collection",
    images: [
      "/products/crewneck-front.jpg",
      "/products/crewneck-back.jpg",
    ],
    sizes: ["S", "M", "L"],
    description:
      "Classic heavyweight crewneck with 'MIGHTY CAIRO' design on back. Premium fleece-lined cotton for comfort.",
    care: "Machine wash cold inside out. Tumble dry low.",
  },
  {
    slug: "enactus-cairo-zip-hoodie",
    name: "Enactus Cairo Zip Hoodie",
    price: 485,
    category: "Winter Collection",
    images: [
      "/products/zipup-front.jpg",
      "/products/zipup-back.jpg",
    ],
    sizes: ["S", "M", "L"],
    description:
      "Exclusive zip-up hoodie featuring 'ENACTUS CAIRO 2026' front print and large star logo on back.",
    care: "Machine wash cold. Hang dry recommended to preserve print.",
  },
];

export const categories = ["All", "Winter Collection", "Summer Collection"];
