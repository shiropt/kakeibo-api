import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { email: 'sample1.com', name: 'user1' },
      { email: 'sample2.com', name: 'user2' },
      { email: 'sample3.com', name: 'user3' },
      { email: 'sample4.com', name: 'user4' },
      { email: 'sample5.com', name: 'user5' },
      { email: 'sample6.com', name: 'user6' },
      { email: 'sample7.com', name: 'user7' },
      { email: 'sample8.com', name: 'user8' },
      { email: 'sample9.com', name: 'user9' },
      { email: 'sample10.com', name: 'user10' },
      { email: 'sample11.com', name: 'user11' },
      { email: 'sample12.com', name: 'user12' },
      { email: 'sample13.com', name: 'user13' },
      { email: 'sample14.com', name: 'user14' },
      { email: 'sample15.com', name: 'user15' },
    ],
  });

  await prisma.category.createMany({
    data: [
      { name: 'category1' },
      { name: 'category2' },
      { name: 'category3' },
      { name: 'category4' },
      { name: 'category5' },
      { name: 'category6' },
      { name: 'category7' },
      { name: 'category8' },
      { name: 'category9' },
      { name: 'category10' },
      { name: 'category11' },
      { name: 'category12' },
      { name: 'category13' },
      { name: 'category14' },
      { name: 'category15' },
    ],
  });
  await prisma.expenseItem.createMany({
    data: [
      { name: 'item1' },
      { name: 'item2' },
      { name: 'item3' },
      { name: 'item4' },
      { name: 'item5' },
      { name: 'item6' },
      { name: 'item7' },
      { name: 'item8' },
      { name: 'item9' },
      { name: 'item10' },
      { name: 'item11' },
      { name: 'item12' },
      { name: 'item13' },
      { name: 'item14' },
      { name: 'item15' },
    ],
  });
  await prisma.moneyDiary.createMany({
    data: [
      {
        memo: 'memo1',
        withdrawal: 10000,
        payment: 0,
        date: new Date(),
        period: 30,
        userId: 1,
        expenseItemName: 'expenseItemName1',
      },
      {
        memo: 'memo2',
        withdrawal: 20000,
        payment: 0,
        date: new Date(),
        period: 30,
        userId: 2,
        expenseItemName: 'expenseItemName2',
      },
      {
        memo: 'memo3',
        withdrawal: 0,
        payment: 200,
        date: new Date(),
        period: 0,
        userId: 3,
        expenseItemName: 'expenseItemName3',
      },
      {
        memo: 'memo4',
        withdrawal: 0,
        payment: 6000,
        date: new Date(),
        period: 0,
        userId: 1,
        expenseItemName: 'expenseItemName4',
      },
      {
        memo: 'memo5',
        withdrawal: 0,
        payment: 3000,
        date: new Date(),
        period: 0,
        userId: 1,
        expenseItemName: 'expenseItemName5',
      },
      {
        memo: 'memo6',
        withdrawal: 0,
        payment: 400,
        date: new Date(),
        period: 0,
        userId: 1,
        expenseItemName: 'expenseItemName6',
      },
      {
        memo: 'memo7',
        withdrawal: 0,
        payment: 50000,
        date: new Date(),
        period: 0,
        userId: 1,
        expenseItemName: 'expenseItemName2',
      },
      {
        memo: 'memo8',
        withdrawal: 0,
        payment: 7000,
        date: new Date(),
        period: 0,
        userId: 1,
        expenseItemName: 'expenseItemName2',
      },
      {
        memo: 'memo9',
        withdrawal: 0,
        payment: 4000,
        date: new Date(),
        period: 0,
        userId: 2,
        expenseItemName: 'expenseItemName9',
      },
      {
        memo: 'memo10',
        withdrawal: 0,
        payment: 30000,
        date: new Date(),
        period: 0,
        userId: 2,
        expenseItemName: 'expenseItemName2',
      },
      {
        memo: 'memo11',
        withdrawal: 0,
        payment: 10000,
        date: new Date(),
        period: 0,
        userId: 5,
        expenseItemName: 'expenseItemName11',
      },
      {
        memo: 'memo12',
        withdrawal: 0,
        payment: 50000,
        date: new Date(),
        period: 0,
        userId: 5,
        expenseItemName: 'expenseItemName2',
      },
      {
        memo: 'memo13',
        withdrawal: 0,
        payment: 300,
        date: new Date(),
        period: 0,
        userId: 5,
        expenseItemName: 'expenseItemName2',
      },
      {
        memo: 'memo14',
        withdrawal: 0,
        payment: 400000,
        date: new Date(),
        period: 0,
        userId: 6,
        expenseItemName: 'expenseItemName2',
      },
      {
        memo: 'memo15',
        withdrawal: 0,
        payment: 200000,
        date: new Date(),
        period: 0,
        userId: 6,
        expenseItemName: 'expenseItemName2',
      },
    ],
  });
  await prisma.moneyDiary_Category.createMany({
    data: [
      { moneyDiaryId: 1, categoryId: 1 },
      { moneyDiaryId: 1, categoryId: 2 },
      { moneyDiaryId: 1, categoryId: 3 },
      { moneyDiaryId: 1, categoryId: 4 },
      { moneyDiaryId: 1, categoryId: 5 },
      { moneyDiaryId: 2, categoryId: 6 },
      { moneyDiaryId: 2, categoryId: 7 },
      { moneyDiaryId: 3, categoryId: 8 },
      { moneyDiaryId: 4, categoryId: 9 },
      { moneyDiaryId: 5, categoryId: 10 },
      { moneyDiaryId: 6, categoryId: 11 },
      { moneyDiaryId: 7, categoryId: 12 },
      { moneyDiaryId: 8, categoryId: 13 },
      { moneyDiaryId: 9, categoryId: 14 },
      { moneyDiaryId: 10, categoryId: 15 },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
