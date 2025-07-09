// utils/recommendation.js
function recommendProducts(userHistory, cart, productDB) {
  const recommendations = [];

  console.log("🔍 Debug: User history:", userHistory);
  console.log("🔍 Debug: User cart:", cart);
  console.log("🔍 Debug: Product count:", productDB.length);

  // Sample a product to check if it has image field
  if (productDB.length > 0) {
    console.log("🔍 Debug: Sample product:", productDB[0]);
  }

  const purchased = new Set(userHistory);
  const inCart = new Set(cart);

  for (let product of productDB) {
    if (purchased.has(product.name) && !inCart.has(product.name)) {
      console.log(
        "✅ Adding product to recommendations (history match):",
        product.name,
        "Image:",
        product.image
      );
      recommendations.push({
        product: product,
        reason: "You've bought this before",
      });
    }

    if (!purchased.has(product.name) && !inCart.has(product.name)) {
      const categoryMatch = cart.some((item) => {
        const matched = productDB.find((p) => p.name === item);
        return matched && matched.category === product.category;
      });

      if (categoryMatch) {
        console.log(
          "✅ Adding product to recommendations (category match):",
          product.name,
          "Image:",
          product.image
        );
        recommendations.push({
          product: product,
          reason: `Matches category: ${product.category}`,
        });
      }
    }
  }

  // Add some popular items if we don't have enough recommendations
  if (recommendations.length < 3) {
    const popularItems = productDB
      .filter(
        (p) =>
          !purchased.has(p.name) &&
          !inCart.has(p.name) &&
          !recommendations.some((r) => r.product._id === p._id)
      )
      .slice(0, 3 - recommendations.length);

    popularItems.forEach((product) => {
      console.log(
        "✅ Adding popular product:",
        product.name,
        "Image:",
        product.image
      );
      recommendations.push({
        product: product,
        reason: "Popular item",
      });
    });
  }

  console.log("🔍 Debug: Final recommendations count:", recommendations.length);
  return recommendations;
}

module.exports = recommendProducts;
