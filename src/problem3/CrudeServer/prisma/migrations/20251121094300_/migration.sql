/*
  Warnings:

  - You are about to drop the column `user_id` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_user_id_fkey`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `user_id`;

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);
