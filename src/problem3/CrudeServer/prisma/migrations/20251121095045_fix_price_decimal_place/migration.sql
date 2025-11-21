/*
  Warnings:

  - You are about to drop the column `shop_id` on the `products` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `shop_id`,
    MODIFY `price` DECIMAL(10, 2) NOT NULL;
