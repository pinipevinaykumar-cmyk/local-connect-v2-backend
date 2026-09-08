import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed State: Andhra Pradesh
  const apState = await prisma.state.upsert({
    where: { name: 'Andhra Pradesh' },
    update: {},
    create: { id: 1, name: 'Andhra Pradesh' },
  });
  console.log('State seeded:', apState.name);

  // 2. Seed all 26 AP districts
  const districtNames = [
    'Anakapalli',
    'Anantapur',
    'Annamayya',
    'Bapatla',
    'Chittoor',
    'East Godavari',
    'Eluru',
    'Guntur',
    'Kakinada',
    'Konaseema',
    'Krishna',
    'Kurnool',
    'Nandyal',
    'NTR',
    'Palnadu',
    'Parvathipuram Manyam',
    'Prakasam',
    'Srikakulam',
    'Sri Sathya Sai',
    'Tirupati',
    'Visakhapatnam',
    'Vizianagaram',
    'West Godavari',
    'YSR Kadapa',
  ];

  const districts: Record<string, { id: number; name: string; stateId: number }> = {};
  for (const name of districtNames) {
    const district = await prisma.district.upsert({
      where: { stateId_name: { stateId: apState.id, name } },
      update: {},
      create: { name, stateId: apState.id },
    });
    districts[name] = district;
  }
  console.log(`Seeded ${districtNames.length} districts`);

  // 3. Seed sample mandals for Krishna district
  const krishnaDistrict = districts['Krishna'];
  const mandalNames = [
    'Gudivada',
    'Vuyyuru',
    'Pamarru',
    'Pedana',
    'Machilipatnam',
    'Nandigama',
    'Gannavaram',
    'Mylavaram',
  ];

  const mandals: Record<string, { id: number; name: string; districtId: number }> = {};
  for (const name of mandalNames) {
    const mandal = await prisma.mandal.upsert({
      where: { districtId_name: { districtId: krishnaDistrict.id, name } },
      update: {},
      create: { name, districtId: krishnaDistrict.id },
    });
    mandals[name] = mandal;
  }
  console.log(`Seeded ${mandalNames.length} mandals for Krishna district`);

  // 4. Seed sample villages for Gudivada mandal
  const gudivadaMandal = mandals['Gudivada'];
  const villageNames = ['Bethavolu', 'Kankipadu', 'Musunuru', 'Kruthivennu'];

  for (const name of villageNames) {
    await prisma.village.upsert({
      where: { mandalId_name: { mandalId: gudivadaMandal.id, name } },
      update: {},
      create: { name, mandalId: gudivadaMandal.id },
    });
  }
  console.log(`Seeded ${villageNames.length} villages for Gudivada mandal`);

  // 5. Seed categories
  const categories = [
    { name: 'Healthcare', icon: '🏥' },
    { name: 'Grocery', icon: '🛒' },
    { name: 'Vegetables', icon: '🥦' },
    { name: 'Chicken & Meat', icon: '🍗' },
    { name: 'Bakery', icon: '🍞' },
    { name: 'Milk & Dairy', icon: '🥛' },
    { name: 'Hotel & Food', icon: '🏨' },
    { name: 'Hardware', icon: '🔧' },
    { name: 'Clothing', icon: '👗' },
    { name: 'Electronics', icon: '📱' },
    { name: 'Salon', icon: '✂️' },
    { name: 'Petrol Bunk', icon: '⛽' },
    { name: 'Services', icon: '🛠️' },
    { name: 'Others', icon: '📦' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { icon: cat.icon },
      create: { name: cat.name, icon: cat.icon },
    });
  }
  console.log(`Seeded ${categories.length} categories`);

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
