import { Prisma, PrismaClient, BrandType, ProductType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const users: Prisma.usersCreateInput[] = [
        {
            email: 'user@example.com',
            password: 'Password123',
        },
        {
            email: 'kelvin@example.com',
            password: 'Kelvin123',
        },
        {
            email: 'wendy@example.com',
            password: 'Wendy123',
        },
        {
            email: 'joe@example.com',
            password: 'Joe123',
        }
    ];

    const brands: Prisma.brandCreateInput[] = [
        {
            name: 'Gucci',
            type: BrandType.INTERNATIONAL,
        },
        {
            name: 'Sony',
            type: BrandType.BUDGET,
        },
        {
            name: 'Parada',
            type: BrandType.LUXURY,
        },
        {
            name: 'CK',
            type: BrandType.LUXURY,
        },
    ];


    const products: Prisma.productsCreateInput[] = [
        {
            name: 'Shirt',
            price: 10.50,
            type: ProductType.CLOTHING,
            brand: {
                connect: { id: 1 }
            },
        },
        {
            name: 'Phone',
            price: 599.99,
            type: ProductType.ELECTRONICS,
            brand: {
                connect: { id: 2 }
            },
        },
        {
            name: 'Perfume',
            price: 19.99,
            type: ProductType.OTHER,
            brand: {
                connect: { id: 3 }
            },
        },
        {
            name: 'Toy Car',
            price: 25.00,
            type: ProductType.OTHER,
            brand: {
                connect: { id: 4 }
            },
        },
    ];



    // Create brands
    for (const brandData of brands) {
        await prisma.brand.create({
            data: brandData,
        });
    }

    // Create products
    for (const productData of products) {
        await prisma.products.create({
            data: productData,
        });
    }
    // Hash passwords and create users
    for (const userData of users) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const existingUser = await prisma.users.findFirst({
            where: { email: userData.email }
        });
        const products = await prisma.products.findMany();
        if (!existingUser) {

            const randomCount = Math.floor(Math.random() * 3) + 1;
            const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
            const randomProducts = shuffledProducts.slice(0, randomCount);

            await prisma.users.create({
                data: {
                    email: userData.email,
                    password: hashedPassword,
                    user_product: {
                        create: randomProducts.map((product) => ({
                            product_id: product.id
                        }))
                    }
                },
            });
        }
    }

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
