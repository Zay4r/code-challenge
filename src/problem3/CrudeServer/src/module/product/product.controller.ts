import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { helper, response } from "../../helper/helper";

import { ResponseCode } from "../../enums/response";
import { checkValidProductIds } from "./product.service";

export const buy = async (req: Request, res: Response) => {
    try {
        const { products } = req.body;
        const userId = (req as any).user.id;

        const productIds = products.map((p: any) => p.product_id);
        const existingProducts = await checkValidProductIds(productIds);

        if (existingProducts.length !== productIds.length) {
            return response.fail(res, 400, {
                message: "Some products are not found"
            });
        }

        // Check which user_product records already exist
        const existingUserProducts = await prisma.user_product.findMany({
            where: {
                user_id: userId,
                product_id: { in: productIds }
            }
        });

        const existingProductIds = new Set(existingUserProducts.map(up => up.product_id));

        // Separate into new and existing products
        const newProducts = products.filter((p: any) => !existingProductIds.has(p.product_id));
        const existingProductsToUpdate = products.filter((p: any) => existingProductIds.has(p.product_id));

        // Create new user_product records
        if (newProducts.length > 0) {
            await prisma.user_product.createMany({
                data: newProducts.map((p: any) => ({
                    user_id: userId,
                    product_id: p.product_id,
                    quantity: p.quantity
                }))
            });
        }

        // Update quantities for existing products
        if (existingProductsToUpdate.length > 0) {
            await Promise.all(
                existingProductsToUpdate.map((p: any) =>
                    prisma.user_product.updateMany({
                        where: {
                            user_id: userId,
                            product_id: p.product_id
                        },
                        data: {
                            quantity: {
                                increment: p.quantity
                            }
                        }
                    })
                )
            );
        }

        return response.success(res, 200, ResponseCode.SUCCESS, {
            message: "Products purchased successfully",
            purchased_products: products
        });

    } catch (error) {
        return response.internal(
            res,
            500,
            ResponseCode.INTERNAL_SERVER_ERROR,
            error as unknown as string
        );
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const { products } = req.body;
        const userId = (req as any).user.id;

        const productIds = products.map((p: any) => p.product_id);
        const existingProducts = await checkValidProductIds(productIds);

        if (existingProducts.length !== productIds.length) {
            return response.fail(res, 400, {
                message: "Some products are not found"
            });
        }

        // Check which user_product records already exist
        const existingUserProducts = await prisma.user_product.findMany({
            where: {
                user_id: userId,
                product_id: { in: productIds }
            }
        });

        const existingProductIds = new Set(existingUserProducts.map(up => up.product_id));

        // Only process products that user actually owns
        const ownedProducts = products.filter((p: any) => existingProductIds.has(p.product_id));

        // Update quantities by decrementing (removing)
        if (ownedProducts.length > 0) {
            await Promise.all(
                ownedProducts.map((p: any) =>
                    prisma.user_product.updateMany({
                        where: {
                            user_id: userId,
                            product_id: p.product_id
                        },
                        data: {
                            quantity: {
                                decrement: p.quantity
                            }
                        }
                    })
                )
            );
        }

        // Remove products with quantity 0 or less
        await prisma.user_product.deleteMany({
            where: {
                user_id: userId,
                product_id: { in: ownedProducts.map((p: any) => p.product_id) },
                quantity: {
                    lte: 0
                }
            }
        });

        return response.success(res, 200, ResponseCode.SUCCESS, {
            message: "Products removed successfully",
            removed_products: ownedProducts
        });

    } catch (error) {
        return response.internal(
            res,
            500,
            ResponseCode.INTERNAL_SERVER_ERROR,
            error as unknown as string
        );
    }
};

export const get = async (req: Request, res: Response) => {
    try {
        const { min_price, max_price, type, brand_id, search } = req.query;


        const where: any = {
            del_flg: 0
        };

        if (search) {
            where.name = {
                contains: search as string
            };
        }

        if (min_price || max_price) {
            where.price = {};
            if (min_price) where.price.gte = parseFloat(min_price as string);
            if (max_price) where.price.lte = parseFloat(max_price as string);
        }

        if (type) {
            where.type = type;
        }

        if (brand_id) {
            where.brand_id = parseInt(brand_id as string);
        }

        const products = await prisma.products.findMany({
            where,
            include: {
                brand: true
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return response.success(res, 200, ResponseCode.SUCCESS, {
            products,
            count: products.length
        });

    } catch (error) {
        return response.internal(
            res,
            500,
            ResponseCode.INTERNAL_SERVER_ERROR,
            error as unknown as string
        );
    }


};
export const getBoughtProducts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const boughtProducts = await prisma.products.findMany({
            where: {
                user_product: {
                    some: {
                        user_id: userId
                    }
                }
            },
            include: {
                brand: true,
                user_product: {
                    where: {
                        user_id: userId
                    }
                }
            }
        });

        // Add quantities to the products
        const products = boughtProducts.map(product => ({
            ...product,
            quantity: product.user_product[0]?.quantity,
            total_price: Number(product.user_product[0]?.quantity) * Number(product.price)
        }));

        return response.success(res, 200, ResponseCode.SUCCESS, {
            products,
            count: products.length
        });

    } catch (error) {
        return response.internal(
            res,
            500,
            ResponseCode.INTERNAL_SERVER_ERROR,
            error as unknown as string
        );
    }
};

export const getDetail = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const product = await prisma.products.findFirst({
            where: {
                id: id
            },
            include: {
                brand: true
            },
        });

        return response.success(res, 200, ResponseCode.SUCCESS, {
            product,
        });

    } catch (error) {
        return response.internal(
            res,
            500,
            ResponseCode.INTERNAL_SERVER_ERROR,
            error as unknown as string
        );
    }


};
export const deleteProducts = async (req: Request, res: Response) => {
    try {
        const { product_ids } = req.body;
        const userId = (req as any).user.id;

        await prisma.user_product.deleteMany({
            where: {
                user_id: userId,
                product_id: { in: product_ids }
            }
        });


        return response.success(res, 200, ResponseCode.SUCCESS, {
            message: "Products deleted successfully",
        });

    } catch (error) {
        return response.internal(
            res,
            500,
            ResponseCode.INTERNAL_SERVER_ERROR,
            error as unknown as string
        );
    }
};