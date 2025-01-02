-- CreateTable
CREATE TABLE `tb_outlets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `alamat` VARCHAR(255) NOT NULL,
    `tlp` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `id_outlet` INTEGER NOT NULL,
    `role` ENUM('admin', 'kasir', 'owner') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tb_users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_pakets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_outlet` INTEGER NOT NULL,
    `jenis` ENUM('kiloan', 'selimut', 'bed_cover', 'kaos', 'lain') NOT NULL,
    `harga` INTEGER NOT NULL,
    `nama_paket` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `jenis_kelamin` ENUM('laki_laki', 'perempuan') NOT NULL,
    `tlp` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_transaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_outlet` INTEGER NOT NULL,
    `kode_invoice` VARCHAR(100) NOT NULL,
    `id_member` INTEGER NOT NULL,
    `tgl` DATETIME(3) NOT NULL,
    `batas_waktu` DATETIME(3) NOT NULL,
    `tgl_bayar` DATETIME(3) NOT NULL,
    `biaya_tambahan` INTEGER NOT NULL,
    `diskon` DECIMAL(8, 2) NOT NULL,
    `pajak` INTEGER NOT NULL,
    `status` ENUM('baru', 'proses', 'selesai', 'diambil') NOT NULL,
    `dibayar` ENUM('dibayar', 'belum_dibayar') NOT NULL,
    `id_user` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tb_detail_transaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_transaksi` INTEGER NOT NULL,
    `id_paket` INTEGER NOT NULL,
    `qty` DECIMAL NOT NULL,
    `keterangan` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tb_users` ADD CONSTRAINT `tb_users_id_outlet_fkey` FOREIGN KEY (`id_outlet`) REFERENCES `tb_outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_pakets` ADD CONSTRAINT `tb_pakets_id_outlet_fkey` FOREIGN KEY (`id_outlet`) REFERENCES `tb_outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_transaksi` ADD CONSTRAINT `tb_transaksi_id_outlet_fkey` FOREIGN KEY (`id_outlet`) REFERENCES `tb_outlets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_transaksi` ADD CONSTRAINT `tb_transaksi_id_member_fkey` FOREIGN KEY (`id_member`) REFERENCES `tb_members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_transaksi` ADD CONSTRAINT `tb_transaksi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `tb_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_detail_transaksi` ADD CONSTRAINT `tb_detail_transaksi_id_transaksi_fkey` FOREIGN KEY (`id_transaksi`) REFERENCES `tb_transaksi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_detail_transaksi` ADD CONSTRAINT `tb_detail_transaksi_id_paket_fkey` FOREIGN KEY (`id_paket`) REFERENCES `tb_pakets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
