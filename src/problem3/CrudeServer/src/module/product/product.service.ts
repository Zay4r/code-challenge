
import { prisma } from "../../utils/prisma";



export async function checkValidProductIds(product_ids: number[]) {
    const existingProducts = await prisma.products.findMany({
        where: {
            id: {
                in: product_ids,
            },
        },
    });
    return existingProducts;
}

export async function saveInUserProduct(userId: number, product_ids: number[]) {
    await prisma.user_product.createMany({
        data: product_ids.map((productId: number) => ({
            user_id: userId,
            product_id: productId
        })),
        skipDuplicates: true
    });

}