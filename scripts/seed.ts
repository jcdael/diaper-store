import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const IMAGE_URLS: Record<string, string> = {
  'Newborn': 'https://cdn.abacus.ai/images/0375f620-b702-4d27-a989-e9996807ebce.png',
  'Size 1': 'https://cdn.abacus.ai/images/60219826-8928-423d-9fb8-12531d3a1e45.png',
  'Size 2': 'https://cdn.abacus.ai/images/a88eecaa-c346-4c7b-aed4-50e21c0bc1cf.png',
  'Size 3': 'https://cdn.abacus.ai/images/610f13d6-a097-49f6-9a00-9181161f2270.png',
  'Size 4': 'https://cdn.abacus.ai/images/141683c1-bd22-43e0-b667-226ce25d7c82.png',
  'Size 5': 'https://cdn.abacus.ai/images/7aa294e8-10d1-4b2e-b511-bb10f32ccb1e.png',
  'Size 6': 'https://cdn.abacus.ai/images/02393822-a1d7-49d4-9eef-295124df8490.png',
};

const SIZES = [
  { size: 'Newborn', weightRange: 'Up to 10 lbs', description: 'Our softest diapers designed for your brand new arrival. Ultra-gentle on delicate newborn skin with a special umbilical cord cutout for comfort. Wetness indicator changes color when it\'s time for a change.' },
  { size: 'Size 1', weightRange: '8-14 lbs', description: 'Perfect for growing babies who need a snug, secure fit. Soft, breathable materials keep your baby comfortable around the clock. Flexible waistband adapts to your baby\'s movements.' },
  { size: 'Size 2', weightRange: '12-18 lbs', description: 'Designed for active babies who are starting to explore. Enhanced absorbency core locks away moisture for up to 12 hours. Stretchy sides provide a comfortable, gap-free fit.' },
  { size: 'Size 3', weightRange: '16-28 lbs', description: 'Ideal for curious crawlers and early walkers. Reinforced leak guards provide extra protection during active play. Super-soft outer cover is gentle on sensitive skin.' },
  { size: 'Size 4', weightRange: '22-37 lbs', description: 'Built for adventurous toddlers on the move. Maximum absorbency keeps even the heaviest wetters dry and comfortable. Easy-open sides make diaper changes quick and hassle-free.' },
  { size: 'Size 5', weightRange: '27+ lbs', description: 'Extra protection for bigger toddlers who are always on the go. Extended coverage in front and back prevents leaks in any position. Breathable materials keep skin dry and healthy.' },
  { size: 'Size 6', weightRange: '35+ lbs', description: 'Our largest size for big kids who still need nighttime protection. Ultra-absorbent core handles the heaviest wetting for uninterrupted sleep. Comfortable, underwear-like fit that kids love.' },
];

const PACK_TYPES = [
  { type: 'Standard Pack', countMultiplier: 1, priceMultiplier: 1 },
  { type: 'Value Pack', countMultiplier: 2, priceMultiplier: 1.85 },
  { type: 'Bulk Box', countMultiplier: 4, priceMultiplier: 3.5 },
];

const BASE_COUNTS: Record<string, number> = {
  'Newborn': 36,
  'Size 1': 32,
  'Size 2': 30,
  'Size 3': 28,
  'Size 4': 26,
  'Size 5': 24,
  'Size 6': 22,
};

const BASE_PRICES: Record<string, number> = {
  'Newborn': 8.99,
  'Size 1': 9.49,
  'Size 2': 9.99,
  'Size 3': 10.49,
  'Size 4': 10.99,
  'Size 5': 11.49,
  'Size 6': 11.99,
};

const ORIGINAL_PRICE_MULTIPLIER = 1.45;

const FEATURES = [
  'Ultra-soft, cloth-like outer cover',
  'Hypoallergenic — dermatologist tested',
  'Up to 12-hour leak protection',
  'Wetness indicator strip',
  'Flexible, snug-fit waistband',
  'Breathable materials for airflow',
  'Free of chlorine, latex, and fragrances',
  'Triple leak-guard barriers',
];

const REVIEW_DATA = [
  { author: 'Sarah M.', rating: 5, title: 'Best diapers we\'ve tried!', content: 'We\'ve gone through so many brands and these are by far the best. No leaks, super soft, and our baby seems so comfortable. The price is unbeatable too!' },
  { author: 'Jennifer L.', rating: 5, title: 'Amazing value', content: 'I can\'t believe how affordable these are without sacrificing quality. They hold up great overnight and my daughter has had zero rashes since switching.' },
  { author: 'Mike T.', rating: 4, title: 'Great quality for the price', content: 'Really impressed with these diapers. They\'re soft, absorbent, and don\'t irritate my son\'s sensitive skin. Only giving 4 stars because the wetness indicator could be more visible.' },
  { author: 'Emily R.', rating: 5, title: 'Our go-to diapers now', content: 'After trying every brand at the store, we stumbled on these and haven\'t looked back. Zero leaks, even overnight. My baby sleeps through the night without any issues.' },
  { author: 'Amanda K.', rating: 5, title: 'So soft and absorbent!', content: 'These feel like premium diapers at a fraction of the cost. The fit is perfect and they\'re incredibly soft against my baby\'s skin. Highly recommend!' },
  { author: 'David W.', rating: 4, title: 'Pleasantly surprised', content: 'Was skeptical at first but these diapers perform just as well as the name brands. Good absorbency, comfortable fit, and great price point.' },
  { author: 'Lisa P.', rating: 5, title: 'Never going back to name brands', content: 'Why did I spend so much on name brand diapers? These are just as good if not better. Saving hundreds per month and my baby is happier!' },
  { author: 'Rachel H.', rating: 5, title: 'Perfect for sensitive skin', content: 'My baby has very sensitive skin and these diapers have been a lifesaver. No rashes, no irritation, and they keep her dry all night long.' },
  { author: 'Chris B.', rating: 4, title: 'Solid everyday diaper', content: 'These are reliable and affordable. We use them daily and rarely have any leaks. Great bang for your buck.' },
  { author: 'Nicole S.', rating: 5, title: 'Bulk box is the way to go', content: 'The bulk box is an incredible deal. We go through so many diapers and this saves us a fortune. Quality is consistently excellent.' },
  { author: 'Jessica F.', rating: 5, title: 'Exceeded my expectations', content: 'I ordered these on a whim and I\'m so glad I did. The quality rivals premium brands at half the price. My pediatrician even approved!' },
  { author: 'Tom G.', rating: 4, title: 'Good quality, fast shipping', content: 'Arrived quickly and the diapers are great quality. Soft, absorbent, and fit well. Will definitely reorder when we run out.' },
  { author: 'Maria C.', rating: 5, title: 'Hospital-quality at home', content: 'These remind me of the diapers they used at the hospital. Premium feel, excellent absorption, and so gentle on newborn skin.' },
  { author: 'Brandon D.', rating: 5, title: 'Dad-approved!', content: 'Easy to put on, stays in place during active play, and no blowouts. As a dad who changes a lot of diapers, these get my full approval.' },
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('Seeding database...');

  let reviewIndex = 0;

  for (const sizeData of SIZES) {
    for (const packData of PACK_TYPES) {
      const packCount = Math.round(BASE_COUNTS[sizeData.size] * packData.countMultiplier);
      const price = parseFloat((BASE_PRICES[sizeData.size] * packData.priceMultiplier).toFixed(2));
      const originalPrice = parseFloat((price * ORIGINAL_PRICE_MULTIPLIER).toFixed(2));
      const name = `LittleBundle ${sizeData.size} Diapers — ${packData.type} (${packCount} ct)`;
      const slug = slugify(`${sizeData.size}-${packData.type}-${packCount}`);

      const product = await prisma.product.upsert({
        where: { slug },
        update: {
          name,
          size: sizeData.size,
          weightRange: sizeData.weightRange,
          packCount,
          packType: packData.type,
          price,
          originalPrice,
          description: sizeData.description,
          features: FEATURES,
          imageUrl: IMAGE_URLS[sizeData.size],
          inStock: true,
        },
        create: {
          name,
          slug,
          size: sizeData.size,
          weightRange: sizeData.weightRange,
          packCount,
          packType: packData.type,
          price,
          originalPrice,
          description: sizeData.description,
          features: FEATURES,
          imageUrl: IMAGE_URLS[sizeData.size],
          inStock: true,
        },
      });

      // Add 2 reviews per product
      for (let i = 0; i < 2; i++) {
        const review = REVIEW_DATA[reviewIndex % REVIEW_DATA.length];
        const reviewId = `review-${slug}-${i}`;
        await prisma.review.upsert({
          where: { id: reviewId },
          update: {
            productId: product.id,
            author: review.author,
            rating: review.rating,
            title: review.title,
            content: review.content,
            verified: true,
          },
          create: {
            id: reviewId,
            productId: product.id,
            author: review.author,
            rating: review.rating,
            title: review.title,
            content: review.content,
            verified: true,
          },
        });
        reviewIndex++;
      }

      console.log(`Seeded: ${name}`);
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e: any) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
