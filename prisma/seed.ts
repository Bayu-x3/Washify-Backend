import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seeding Outlets
  await prisma.outlets.createMany({
    data: [
      { nama: "Outlet 1", alamat: "Alamat 1", tlp: 1234567891 },
      { nama: "Outlet 2", alamat: "Alamat 2", tlp: 1234567892 },
      { nama: "Outlet 3", alamat: "Alamat 3", tlp: 1234567893 },
    ],
  });

  console.log("Outlets seeded");

  const outletOne = await prisma.outlets.findFirst({ where: { nama: "Outlet 1" } });
  const outletTwo = await prisma.outlets.findFirst({ where: { nama: "Outlet 2" } });
  const outletThree = await prisma.outlets.findFirst({ where: { nama: "Outlet 3" } });

  // Seeding Users
  const adminPass = await bcrypt.hash("admin123", 10);
  const kasirPass = await bcrypt.hash("kasir123", 10);
  const ownerPass = await bcrypt.hash("owner123", 10);

  await prisma.users.createMany({
    data: [
      { nama: "Admin", username: "admin", password: adminPass, id_outlet: outletOne?.id || 1, role: "admin" },
      { nama: "Kasir 1", username: "kasir1", password: kasirPass, id_outlet: outletTwo?.id || 2, role: "kasir" },
      { nama: "Owner", username: "owner", password: ownerPass, id_outlet: outletThree?.id || 3, role: "owner" },
      { nama: "Kasir 2", username: "kasir2", password: kasirPass, id_outlet: outletOne?.id || 1, role: "kasir" },
      { nama: "Kasir 3", username: "kasir3", password: kasirPass, id_outlet: outletTwo?.id || 2, role: "kasir" },
    ],
  });

  console.log("Users seeded");

  // Seeding Members
  await prisma.members.createMany({
    data: [
      { nama: "Icy Man", alamat: "Jl. Raya 1", jenis_kelamin: "laki_laki", tlp: 1234567890 },
      { nama: "Manzy", alamat: "Jl. Raya 2", jenis_kelamin: "perempuan", tlp: 9876543210 },
      { nama: "King", alamat: "Jl. Raya 3", jenis_kelamin: "perempuan", tlp: 1230984567 },
    ],
  });

  console.log("Members seeded");

  const memberOne = await prisma.members.findFirst({ where: { nama: "Icy Man" } });
  const memberTwo = await prisma.members.findFirst({ where: { nama: "Manzy" } });
  const memberThree = await prisma.members.findFirst({ where: { nama: "King" } });

  // Seeding Pakets
  await prisma.pakets.createMany({
    data: [
      { id_outlet: outletOne?.id || 1, jenis: "kiloan" },
      { id_outlet: outletOne?.id || 1, jenis: "selimut" },
      { id_outlet: outletTwo?.id || 2, jenis: "bed_cover" },
      { id_outlet: outletTwo?.id || 2, jenis: "kaos" },
      { id_outlet: outletThree?.id || 3, jenis: "lain" },
    ],
  });

  console.log("Pakets seeded");

  const paketOne = await prisma.pakets.findFirst({ where: { jenis: "kiloan" } });
  const paketTwo = await prisma.pakets.findFirst({ where: { jenis: "selimut" } });
  const paketThree = await prisma.pakets.findFirst({ where: { jenis: "bed_cover" } });

  // Seeding Transaksi
  await prisma.transaksi.createMany({
    data: [
      {
        id_outlet: outletOne?.id || 1,
        kode_invoice: "INV001",
        id_member: memberOne?.id || 1,
        tgl: new Date(),
        batas_waktu: new Date(new Date().setDate(new Date().getDate() + 3)),
        tgl_bayar: new Date(),
        biaya_tambahan: 5000,
        diskon: 10.0,
        pajak: 2000,
        status: "baru",
        dibayar: "dibayar",
        id_user: 1,
      },
      {
        id_outlet: outletTwo?.id || 2,
        kode_invoice: "INV002",
        id_member: memberTwo?.id || 2,
        tgl: new Date(),
        batas_waktu: new Date(new Date().setDate(new Date().getDate() + 3)),
        tgl_bayar: new Date(),
        biaya_tambahan: 3000,
        diskon: 5.0,
        pajak: 1500,
        status: "proses",
        dibayar: "belum_dibayar",
        id_user: 2,
      },
      {
        id_outlet: outletThree?.id || 3,
        kode_invoice: "INV003",
        id_member: memberThree?.id || 3,
        tgl: new Date(),
        batas_waktu: new Date(new Date().setDate(new Date().getDate() + 3)),
        tgl_bayar: new Date(),
        biaya_tambahan: 1000,
        diskon: 15.0,
        pajak: 1000,
        status: "selesai",
        dibayar: "dibayar",
        id_user: 3,
      },
    ],
  });

  console.log("Transaksi seeded");

  // Seeding Detail Transaksi
  const transaksiOne = await prisma.transaksi.findFirst({ where: { kode_invoice: "INV001" } });
  const transaksiTwo = await prisma.transaksi.findFirst({ where: { kode_invoice: "INV002" } });
  const transaksiThree = await prisma.transaksi.findFirst({ where: { kode_invoice: "INV003" } });

  await prisma.detailTransaksi.createMany({
    data: [
      {
        id_transaksi: transaksiOne?.id || 1,
        id_paket: paketOne?.id || 1,
        qty: 2,
        keterangan: "Cuci bersih dan setrika",
      },
      {
        id_transaksi: transaksiTwo?.id || 2,
        id_paket: paketTwo?.id || 2,
        qty: 1,
        keterangan: "Hanya cuci",
      },
      {
        id_transaksi: transaksiThree?.id || 3,
        id_paket: paketThree?.id || 3,
        qty: 3,
        keterangan: "Setrika dan lipat",
      },
    ],
  });

  console.log("Detail Transaksi seeded");
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
