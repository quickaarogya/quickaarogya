import prisma from '../src/lib/prisma';

async function main() {
  try {
    const orgs = await prisma.organization.findMany({
      include: { staffMembers: { include: { user: true } } }
    });
    console.log('ORGS COUNT:', orgs.length);
    orgs.forEach(o => {
      console.log(`- Org: ${o.name} (${o.type}) | Staff: ${o.staffMembers.length}`);
      o.staffMembers.forEach(s => {
        console.log(`   -> Staff: ${s.user.email} [${s.role}] (Active: ${s.isActive})`);
      });
    });
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
