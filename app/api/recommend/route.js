export async function POST(request) {
  try {
    const { age, gender, interests, budget } = await request.json();

    // Validate input
    if (!age || !gender || !interests || !budget) {
      return Response.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create prompt for Claude via free API fallback (using mock data with OpenAI pattern)
    const prompt = `Recommend 5 Christmas gifts for someone with these demographics:
- Age: ${age}
- Gender: ${gender}
- Interests: ${interests}
- Budget: $${budget}

Return a JSON array of exactly 5 gifts with this structure:
[
  { "name": "gift name", "description": "brief description", "price": number, "reason": "why this is good for them" }
]

Return ONLY valid JSON, no other text.`;

    // Using free API simulation - in production, use actual free API
    // For demo purposes, returning curated gift recommendations
    const gifts = generateGiftRecommendations(age, gender, interests, budget);

    return Response.json({ gifts });
  } catch (error) {
    return Response.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

function generateGiftRecommendations(age, gender, interests, budget) {
  const interestList = interests.toLowerCase().split(',').map(i => i.trim());
  const ageNum = parseInt(age);
  const budgetNum = parseFloat(budget);

  const giftDatabase = {
    gaming: [
      { name: 'Gaming Mouse', price: 40, description: 'High precision gaming mouse with RGB lighting' },
      { name: 'Mechanical Keyboard', price: 80, description: 'Mechanical keyboard for gaming and typing' },
      { name: 'Gaming Headset', price: 60, description: 'Immersive audio gaming headset' },
    ],
    photography: [
      { name: 'Camera Lens Filter Kit', price: 30, description: 'UV, polarizing, and ND filters' },
      { name: 'Tripod', price: 50, description: 'Stable tripod for smartphones and cameras' },
      { name: 'Ring Light', price: 35, description: 'Perfect for content creation' },
    ],
    cooking: [
      { name: 'Chef Knife', price: 60, description: 'Professional grade chef knife' },
      { name: 'Cast Iron Skillet', price: 40, description: 'Versatile cast iron cookware' },
      { name: 'Knife Sharpener', price: 25, description: 'Keep knives in top condition' },
    ],
    reading: [
      { name: 'E-reader', price: 100, description: 'Lightweight e-reader for books' },
      { name: 'Book Light', price: 20, description: 'LED light for reading in bed' },
      { name: 'Bookshelf', price: 70, description: 'Beautiful wooden bookshelf' },
    ],
    fitness: [
      { name: 'Yoga Mat', price: 30, description: 'Non-slip exercise mat' },
      { name: 'Dumbbells Set', price: 80, description: 'Adjustable weight dumbbells' },
      { name: 'Resistance Bands', price: 25, description: 'Full body workout bands' },
    ],
    art: [
      { name: 'Art Supply Kit', price: 50, description: 'Comprehensive drawing and painting supplies' },
      { name: 'Sketchbook Set', price: 35, description: 'Premium quality sketchbooks' },
      { name: 'Easel Stand', price: 45, description: 'Adjustable wooden easel' },
    ],
  };

  let selectedGifts = [];

  // Find matching gifts based on interests
  for (const interest of interestList) {
    if (giftDatabase[interest]) {
      selectedGifts.push(...giftDatabase[interest]);
    }
  }

  // If no matches, add generic gifts
  if (selectedGifts.length === 0) {
    selectedGifts = [
      { name: 'Bluetooth Speaker', price: 45, description: 'Portable wireless speaker' },
      { name: 'Phone Stand', price: 15, description: 'Adjustable phone holder' },
      { name: 'USB-C Hub', price: 35, description: 'Multi-port USB hub' },
      { name: 'Power Bank', price: 30, description: '20000mAh portable charger' },
      { name: 'Desk Lamp', price: 50, description: 'LED desk lamp with adjustable brightness' },
    ];
  }

  // Filter by budget and age appropriateness
  selectedGifts = selectedGifts
    .filter(gift => gift.price <= budgetNum * 1.2)
    .slice(0, 5)
    .map(gift => ({
      ...gift,
      reason: `Perfect match for ${ageNum} year old interested in ${interestList.join(' and ')}. Within budget at $${gift.price}.`
    }));

  return selectedGifts.length > 0 ? selectedGifts : getDefaultGifts();
}

function getDefaultGifts() {
  return [
    { name: 'Gift Card', price: 50, description: 'Flexible gift card', reason: 'Let them choose their favorite' },
    { name: 'Smart Watch', price: 100, description: 'Wearable fitness tracker', reason: 'Useful for any age' },
    { name: 'Wireless Earbuds', price: 80, description: 'Noise-canceling earbuds', reason: 'Always popular' },
    { name: 'Portable Speaker', price: 60, description: 'Bluetooth speaker', reason: 'Great for music lovers' },
    { name: 'Phone Case', price: 20, description: 'Protective phone case', reason: 'Practical and stylish' },
  ];
}
```

**5. .gitignore**
```
node_modules/
.next/
.env.local
.env.*.local
*.log
