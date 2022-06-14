import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from '@colors/colors';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
	try {
		await Order.deleteMany();
		await Product.deleteMany();
		await User.deleteMany();
		// save createdUsers array to users collection
		const createdUsers = await User.insertMany(users);
		// get the admin from createdUsers array
		const adminUser = createdUsers[0]._id;
		// add adminUser to products array as user
		const sampleProducts = products.map(product => {
			return { ...product, user: adminUser };
		});
		// save products and adminUser to products collection
		await Product.insertMany(sampleProducts);

		console.log('Data imported!'.green.inverse);
		process.exit();
	} catch (error) {
		console.error(`${error}`.red.inverse);
		process.exit(1);
	}
};

const destroyData = async () => {
	try {
		await Order.deleteMany();
		await Product.deleteMany();
		await User.deleteMany();

		console.log('Data Destroyed!'.green.inverse);
		process.exit();
	} catch (error) {
		console.error(`${error}`.red.inverse);
		process.exit(1);
	}
};

// check if '-d' is the third argument typed into the terminal
if (process.argv[2] === '-d') {
	destroyData();
	//console.log('you typed -d in the terminal!');
} else {
	importData();
}
