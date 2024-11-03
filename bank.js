const mongoose = require('mongoose');

// Connect To Database
mongoose
  .connect(
    'mongodb+srv://ajrasoft1985:123moslem@cluster0.ow9rt.mongodb.net/bank'
  )
  .then(() => console.log('Connected To MongoDB...'))
  .catch((error) =>
    console.error('We could not connect to MongoDB: ', error.message)
  );

//Accont Schema
const accountSchema = new mongoose.Schema({
  name: String,
  balance: Number,
});

const Account = mongoose.model('Account', accountSchema);

async function transferMoney(senderId, receiverId, amount) {
  // start session for transaction
  const session = await mongoose.startSession();
  session.startTransaction(); // begin transaction

  try {
    //Step1: Find sender and check if it has enough balance;
    const sender = await Account.findById(senderId).session(session);
    if (!sender) throw new Error('Sender acount not found');
    if (sender.balance < amount) throw new Error('Insufficient funds');

    //Step2 deduct amount from sender's account
    sender.balance -= amount;
    await sender.save({ session });

    // step3: find the receiver's account
    const receiver = await Account.findById(receiverId).session(session);
    if (!receiver) throw new Error('Receiver account not found');

    // step4: add amount to receiver's account
    receiver.balance += amount;
    await receiver.save({ session });

    // Commit the transaction to apply change
    await session.commitTransaction();
    session.endSession();
    console.log('Successful Transfer');
  } catch (error) {
    // abort the transaction of an error occurs
    await session.abortTransaction();
    session.endSession();
    console.error('Transaction failed:', error.message);
  }
}

async function createAccounts() {
  try {
    await Account.create([
      {
        name: 'John Doe',
        balance: 1500,
      },
      {
        name: 'Jane Smith',
        balance: 2000,
      },
      {
        name: 'Alice Brown',
        balance: 750,
      },
      {
        name: 'Bob White',
        balance: 500,
      },
      {
        name: 'Emma Johnson',
        balance: 3200,
      },
      {
        name: 'Liam Davis',
        balance: 100,
      },
      {
        name: 'Olivia Wilson',
        balance: 850,
      },
      {
        name: 'William Martinez',
        balance: 4000,
      },
      {
        name: 'Sophia Anderson',
        balance: 2750,
      },
      {
        name: 'James Taylor',
        balance: 600,
      },
    ]);
    console.log('Accounts has been created');
  } catch (error) {
    console.log(error);
  }
}

//createAccounts()
//transferMoney('67277e45bff70cf2c1c53e44', '67277e45bff70cf2c1c53e47', 400);
