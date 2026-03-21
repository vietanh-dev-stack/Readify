import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const BookSchema = new mongoose.Schema({ title: String, status: String });
const InventorySchema = new mongoose.Schema({ bookId: mongoose.Schema.Types.ObjectId, quantity: Number, reserved: Number });

const Book = mongoose.model('Book', BookSchema);
const Inventory = mongoose.model('Inventory', InventorySchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Readify');
  const books = await Book.find({});
  console.log('Books Total:', books.length);
  // console.log('Books:', books.map(b => ({ id: b._id, title: b.title, status: b.status })));
  
  const inventories = await Inventory.find({});
  console.log('Inventories Total:', inventories.length);
  // console.log('Inventories:', inventories.map(i => ({ bookId: i.bookId, qty: i.quantity, res: i.reserved })));
  
  const bookWithNoInventory = [];
  for (const book of books) {
    const inv = inventories.find(i => i.bookId.toString() === book._id.toString());
    if (!inv) bookWithNoInventory.push(book.title);
  }
  
  console.log('Books with NO inventory:', bookWithNoInventory);
  
  await mongoose.disconnect();
}

check().catch(console.error);
