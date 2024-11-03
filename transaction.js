const mongoose = require('mongoose');

// Connect To Database
mongoose
  .connect(
    'mongodb+srv://ajrasoft1985:123moslem@cluster0.ow9rt.mongodb.net/playground'
  )
  .then(() => console.log('Connected To MongoDB...'))
  .catch((error) =>
    console.error('We could not connect to MongoDB: ', error.message)
  );

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  balance: Number,
});

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  status: String,
});

// Models
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

// Create an order
async function createOrder(userId, orderAmount) {
  // start session for transaction
  const session = await mongoose.startSession();
  session.startTransaction(); // begin transaction

  try {
    //Step1: find the user and check if it has enough balance

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error('User was not found!');
    if (user.balance < orderAmount) throw new Error('Insufficient Balance!');

    //Step2: subtruct the balance from the user amount
    user.balance -= orderAmount;
    await user.save({ session });

    //Step3: Create the order
    const order = new Order({
      userId,
      amount: orderAmount,
      status: 'Pending',
    });

    await order.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    console.log('Order Created Successfully');
    return order;
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    console.error('Transaction failed: ', error.message);
  }
}

async function createUsers() {
  try {
    await User.create([
      {
        name: 'Alice Johnson',
        balance: 500,
      },
      {
        name: 'Bob Smith',
        balance: 1000,
      },
      {
        name: 'Charlie Brown',
        balance: 750,
      },
      {
        name: 'Diana Adams',
        balance: 300,
      },
      {
        name: 'Ethan Williams',
        balance: 1200,
      },
    ]);

    console.log('Users Has Been added');
  } catch (error) {
    console.error(error.message);
  }
}
//createUsers();
createOrder('6727753903fac9e48871778b', 200);
