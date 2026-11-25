// PPL Season 2 registration window — IST (UTC+5:30)
export const PPL_REG_OPEN  = new Date('2026-11-05T04:30:00.000Z'); // 10:00 AM IST
export const PPL_REG_CLOSE = new Date('2026-11-06T12:30:00.000Z'); // 6:00 PM IST

export type RegStatus = 'upcoming' | 'open' | 'closed';

export function getRegStatus(now = new Date()): RegStatus {
  const t = now.getTime();
  if (t < PPL_REG_OPEN.getTime())  return 'upcoming';
  if (t <= PPL_REG_CLOSE.getTime()) return 'open';
  return 'closed';
}
