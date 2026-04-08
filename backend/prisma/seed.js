const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create owner
  const owner = await prisma.user.upsert({
    where: { phone: '254712345678' },
    update: {},
    create: {
      phone: '254712345678',
      name: 'Daniel Mwangi',
      email: 'daniel@keja.co.ke',
      role: 'OWNER',
      idNumber: '12345678',
      idVerified: true,
    },
  });

  // Create property
  const property = await prisma.property.create({
    data: {
      name: 'Sunrise Apartments',
      type: 'APARTMENT',
      address: 'Ngong Road, Kilimani',
      county: 'Nairobi',
      town: 'Nairobi',
      totalUnits: 24,
      paybillNumber: '174379',
      ownerId: owner.id,
    },
  });

  // Create units
  const unitData = [];
  for (let floor = 1; floor <= 6; floor++) {
    for (const letter of ['A', 'B', 'C', 'D']) {
      const unitNum = `${floor}${letter}`;
      const rent = floor <= 2 ? 12000 : floor <= 4 ? 15000 : 22000;
      unitData.push({
        propertyId: property.id,
        unitNumber: unitNum,
        floor,
        bedrooms: floor <= 2 ? 1 : floor <= 4 ? 2 : 3,
        rentAmount: rent,
        depositAmount: rent,
        status: 'VACANT',
      });
    }
  }

  await prisma.unit.createMany({ data: unitData });
  const units = await prisma.unit.findMany({ where: { propertyId: property.id } });

  // Create tenants and assign to units
  const tenants = [
    { phone: '254722111111', name: 'James Mwangi' },
    { phone: '254722222222', name: 'Wanjiku Kamau' },
    { phone: '254722333333', name: 'Hassan Omar' },
    { phone: '254722444444', name: 'Njeri Wambui' },
    { phone: '254722555555', name: 'Peter Ochieng' },
    { phone: '254722666666', name: 'Aisha Mohamed' },
    { phone: '254722777777', name: 'Grace Waithera' },
    { phone: '254722888888', name: 'Samuel Kiprop' },
  ];

  for (let i = 0; i < tenants.length; i++) {
    const t = tenants[i];
    const user = await prisma.user.upsert({
      where: { phone: t.phone },
      update: {},
      create: { phone: t.phone, name: t.name, role: 'TENANT' },
    });

    const unit = units[i];
    await prisma.tenancy.create({
      data: {
        unitId: unit.id,
        tenantId: user.id,
        rentAmount: unit.rentAmount,
        depositPaid: unit.depositAmount,
        startDate: new Date('2026-01-01'),
        status: 'ACTIVE',
      },
    });

    await prisma.unit.update({
      where: { id: unit.id },
      data: { status: 'OCCUPIED' },
    });
  }

  // Create sample payments
  const occupiedUnits = await prisma.unit.findMany({
    where: { propertyId: property.id, status: 'OCCUPIED' },
    include: { tenancies: { where: { status: 'ACTIVE' }, include: { tenant: true } } },
  });

  const months = ['2026-01', '2026-02', '2026-03', '2026-04'];
  let receiptCount = 0;

  for (const month of months) {
    for (const unit of occupiedUnits) {
      const tenancy = unit.tenancies[0];
      if (!tenancy) continue;

      // 90% chance of payment each month
      if (Math.random() > 0.9) continue;

      const [year, mon] = month.split('-').map(Number);
      const day = Math.floor(Math.random() * 5) + 1;
      const paidAt = new Date(year, mon - 1, day, 10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));

      const payment = await prisma.payment.create({
        data: {
          propertyId: property.id,
          unitId: unit.id,
          tenancyId: tenancy.id,
          amount: unit.rentAmount,
          mpesaRef: `S${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
          mpesaPhone: tenancy.tenant.phone,
          mpesaName: tenancy.tenant.name,
          accountReference: unit.unitNumber,
          source: 'MPESA_C2B',
          status: 'MATCHED',
          paidAt,
          month,
          receiptSentTenant: true,
          receiptSentLandlord: true,
        },
      });

      receiptCount++;
      await prisma.receipt.create({
        data: {
          paymentId: payment.id,
          receiptNo: `KJ-2026-${String(receiptCount).padStart(5, '0')}`,
          tenantPhone: tenancy.tenant.phone,
          landlordPhone: owner.phone,
          amount: unit.rentAmount,
        },
      });
    }
  }

  // Add a couple unmatched payments
  await prisma.payment.create({
    data: {
      propertyId: property.id,
      amount: 15000,
      mpesaRef: 'SUNKNOWN001',
      mpesaPhone: '254799999999',
      mpesaName: 'UNKNOWN PAYER',
      source: 'MPESA_C2B',
      status: 'UNMATCHED',
      paidAt: new Date(),
      month: '2026-04',
    },
  });

  console.log('Seed complete!');
  console.log(`  Owner: ${owner.name} (${owner.phone})`);
  console.log(`  Property: ${property.name} (${units.length} units)`);
  console.log(`  Tenants: ${tenants.length}`);
  console.log(`  Payments: ${receiptCount} matched + 1 unmatched`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
