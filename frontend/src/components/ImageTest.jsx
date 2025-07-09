import React from "react";

const ImageTest = () => {
  const products = [
    { name: "Bananas", image: "/images/products/product-1-bananas.svg" },
    { name: "Yogurt", image: "/images/products/product-2-yogurt.svg" },
    { name: "Bread", image: "/images/products/product-3-bread.svg" },
    {
      name: "Almond Milk",
      image: "/images/products/product-4-almond-milk.svg",
    },
    { name: "Chicken", image: "/images/products/product-5-chicken.svg" },
    { name: "Rice", image: "/images/products/product-6-rice.svg" },
    { name: "Spinach", image: "/images/products/product-7-spinach.svg" },
    { name: "Quinoa", image: "/images/products/product-8-quinoa.svg" },
    { name: "Milk", image: "/images/products/product-9-milk.svg" },
    { name: "Bread (2)", image: "/images/products/product-10-bread.svg" },
    { name: "Butter", image: "/images/products/product-11-butter.svg" },
    { name: "Eggs", image: "/images/products/product-12-eggs.svg" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">ShopMind Product Images Test</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <div key={index} className="bg-white border rounded-lg p-4 shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-contain mb-2"
              onError={(e) => {
                console.error(`❌ Failed to load: ${product.image}`);
                e.target.style.border = "2px solid red";
                e.target.alt = `ERROR: ${product.name}`;
              }}
              onLoad={() => {
                console.log(`✅ Loaded: ${product.image}`);
              }}
            />
            <p className="text-sm font-medium text-center">{product.name}</p>
            <p className="text-xs text-gray-500 text-center">{product.image}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageTest;
