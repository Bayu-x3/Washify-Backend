/*
  Warnings:

  - You are about to alter the column `qty` on the `tb_detail_transaksi` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,0)` to `Decimal`.

*/
-- AlterTable
ALTER TABLE `tb_detail_transaksi` MODIFY `qty` DECIMAL NOT NULL;
