export const products = [
  {
    id: 1,
    name: "Felpa con Cappuccio",
    price: 89.99,
    category: "felpe",
    image: "/felpalogo.svg",
    description: "Felpa in cotone con cappuccio e logo FlowVix sul davanti. Perfetto per l'autunno e l'inverno.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Pantalone wilde",
    price: 69.99,
    category: "pantaloni",
    image: "/pantalonewilde.svg",
    description: "Pantalone wilde in cotone con logo FlowVix sulla parte sinistra a contrasto, taglio wilde fit. Stile casual/sportivo.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "T-Shirt Basic Cotone",
    price: 29.99,
    category: "tshirt",
    image: "/tshirt-basic-cotone.svg",
    description: "T-shirt in cotone con logo FlowVix sulla parte centrale a contrasto, taglio regolare. Disponibile in due colori nero e bianco.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 4,
    name: "Short Sportivo",
    price: 39.99,
    category: "short",
    image: "/shortsportivo.svg",
    description: "Short sportivo in cotone con logo FlowVix sulla parte centrale a contrasto, taglio regolare. Disponibile in due colori nero e bianco.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 5,
    name: "Cappello baseball FlowVix",
    price: 24.99,
    category: "cappelli",
    image: "/cappellobaseball.svg",
    description: "Cappello baseball con logo FlowVix sulla parte centrale a contrasto, taglio regolare. Disponibile in due colori nero e bianco.",
    sizes: ["unica"],
  },
  {
    id: 6,
    name: "Calzettoni FlowVix",
    price: 9.99,
    category: "calze",
    image: "/calzelogate.svg",
    description: "Calzettoni in cotone con logo FlowVix sulla parte laterale a contrasto, taglio regolare. Disponibile in due colori nero e bianco.",
    sizes: ["UNICA"],
  },
  

];

export const categories = [
  { id: "tutti", label: "Tutti" },
  { id: "felpe", label: "Felpe" },
  { id: "pantaloni", label: "Pantaloni" },
  { id: "tshirt", label: "T-Shirt" },
  { id: "short", label: "Short" },
  { id: "cappelli", label: "Cappelli" },
  { id: "calze", label: "Calze" },
];

export const getProductById = (id) => products.find((p) => p.id === Number(id));
