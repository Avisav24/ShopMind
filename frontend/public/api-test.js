// Quick API Test Script
// Run this in the browser console to test the API

async function testAPI() {
  try {
    console.log("🧪 Testing ShopMind API...");
    
    // Test basic connectivity
    const testResponse = await fetch('http://localhost:5000/test');
    const testData = await testResponse.text();
    console.log("✅ Backend connectivity:", testData);
    
    // Test recommendations endpoint
    const recResponse = await fetch('http://localhost:5000/api/recommendations');
    const recData = await recResponse.json();
    console.log("✅ Recommendations endpoint:", recData);
    
    // Check if products have images
    if (recData.success && recData.recommendations) {
      console.log("📊 Product images in recommendations:");
      recData.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.product.name}: ${rec.product.image}`);
      });
    }
    
    return recData;
    
  } catch (error) {
    console.error("❌ API Test Failed:", error);
    return null;
  }
}

// Run the test
testAPI();
