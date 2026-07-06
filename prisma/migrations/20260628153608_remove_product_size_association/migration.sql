/*
  Warnings:

  - You are about to drop the `product_size_association` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_size_association" DROP CONSTRAINT "product_size_association_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_size_association" DROP CONSTRAINT "product_size_association_size_id_fkey";

-- DropTable
DROP TABLE "product_size_association";

-- CreateTable
CREATE TABLE "_ProductToSize" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_ProductToSize_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductToSize_B_index" ON "_ProductToSize"("B");

-- AddForeignKey
ALTER TABLE "_ProductToSize" ADD CONSTRAINT "_ProductToSize_A_fkey" FOREIGN KEY ("A") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSize" ADD CONSTRAINT "_ProductToSize_B_fkey" FOREIGN KEY ("B") REFERENCES "size"("id") ON DELETE CASCADE ON UPDATE CASCADE;
