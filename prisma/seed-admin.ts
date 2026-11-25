/** Idempotent seed for roles, permissions, default menus and feature flags. Run: npm run db:seed:admin */
import { PrismaClient } from '@prisma/client';
import { DEFAULT_ROLES, PERMISSIONS } from '../src/admin/rbac/permissions';

const prisma = new PrismaClient();

const MENUS: [slug: string, label: string, icon: string, url: string, section: string, moduleKey: string | null][] = [
  ['home', 'Dashboard', 'home', '/home', 'main', 'home'],
  ['explore', 'Explore', 'search', '/discover', 'main', 'explore'],
  ['top_rated', 'Top Rated', 'star', '/discover?sort=rated', 'main', 'top_rated'],
  ['nearby', 'Nearby', 'map-pin', '/discover?nearby=true', 'main', 'nearby'],
  ['businesses', 'Businesses', 'building-2', '/discover?view=businesses', 'main', 'businesses'],
  ['groceries', 'Groceries', 'shopping-basket', '/discover?category=Groceries', 'categories', 'groceries'],
  ['food_meat', 'Food & Meat', 'utensils-crossed', '/discover?category=Food', 'categories', 'food_meat'],
  ['healthcare', 'Healthcare', 'stethoscope', '/discover?category=Healthcare', 'categories', 'healthcare'],
  ['education', 'Education', 'graduation-cap', '/discover?category=Education', 'categories', 'education'],
  ['sports_fitness', 'Sports & Fitness', 'trophy', '/sports', 'categories', 'sports_fitness'],
  ['services', 'Services', 'wrench', '/services', 'categories', 'services'],
  ['jobs', 'Jobs', 'briefcase', '/discover?category=Jobs', 'categories', 'jobs'],
  ['updates_events', 'Updates & Events', 'megaphone', '/community', 'categories', 'updates_events'],
  ['favourites', 'Favourites', 'heart', '/favorites', 'account', null],
  ['my_business', 'My Business', 'store', '/merchant/dashboard', 'account', null],
  ['profile', 'Profile', 'user', '/profile', 'account', null],
  ['settings', 'Settings', 'settings', '/settings', 'account', null],
];

const FEATURES: [string, string][] = [
  ['tournaments', 'Tournaments'], ['jobs', 'Jobs'], ['businesses', 'Businesses'], ['events', 'Events'],
  ['advertisements', 'Advertisements'], ['nearby_services', 'Nearby Services'], ['leaderboards', 'Leaderboards'],
  ['auctions', 'Auctions'], ['registrations', 'Registrations'], ['reviews', 'Reviews'], ['ratings', 'Ratings'],
  ['notifications', 'Notifications'],
];

async function main() {
  for (const [key, description] of Object.entries(PERMISSIONS))
    await prisma.permission.upsert({ where: { key }, update: { description }, create: { key, description } });

  for (const r of DEFAULT_ROLES) {
    const role = await prisma.role.upsert({
      where: { key: r.key }, update: { name: r.name }, create: { key: r.key, name: r.name, isSystem: true },
    });
    // New permissions are added to default roles; admin edits to extra grants are preserved.
    const perms = await prisma.permission.findMany({ where: { key: { in: r.permissions } } });
    await prisma.rolePermission.createMany({
      data: perms.map((p) => ({ roleId: role.id, permissionId: p.id })), skipDuplicates: true,
    });
  }

  // Menus: only create missing ones so admin edits are never overwritten on re-seed.
  for (const [i, [slug, label, icon, url, section, moduleKey]] of MENUS.entries())
    await prisma.menu.upsert({
      where: { slug }, update: {},
      create: { slug, label, icon, url, section, moduleKey, order: i * 10 },
    });

  for (const [key, name] of FEATURES)
    await prisma.featureFlag.upsert({ where: { key }, update: {}, create: { key, name } });

  console.log('Admin seed complete');
}

main().finally(() => prisma.$disconnect());
