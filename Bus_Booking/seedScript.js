import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { buses, generateSeats, locations } from './seatData.js';
import Bus from './model/bus.js';
import bus from './model/bus.js';

dotenv.config();

const generateRandomTime = baseDate => {
  const hour = Math.floor(Math.random() * 12) + 6;
  const minute = Math.random() > 0.5 ? 30 : 0;

  const dateTime = new Date(baseDate);
  dateTime.setHours(hour, minute, 0, 0);

  return dateTime;
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    await Bus.deleteMany({});
    console.log('old bus deleted');

    const busesToInsert = [];

    for (let i = 0; i < locations.length; i++) {
      for (let j = i + 1; j < locations.length; j++) {
        const from = locations[i];
        const to = locations[j];
        const baseDate = new Date();

        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const travelDate = new Date(baseDate);
          travelDate.setUTCDate(baseDate.getUTCDate() + dayOffset);

          buses.forEach(bus => {
            const arrivalTime = generateRandomTime(travelDate);
            const departureTime = generateRandomTime(travelDate);

            busesToInsert.push({
              busId: `${bus.busId}_${from}_${to}_${dayOffset}`,
              from: from,
              to: to,
              departureTime,
              arrivalTime,
              duration: '9h 30m',
              availableSeats: 28,
              price: bus.price,
              originalPrice: bus.originalPrice,
              company: bus.company,
              busType: bus.busType,
              rating: bus.rating,
              totalReviews: bus.totalReviews,
              badges: bus.badges,
              seats: generateSeats(),
            });
            busesToInsert.push({
              busId: `${bus.busId}_${to}_${from}_${dayOffset + 1}`,
              from: to,
              to: from,
              departureTime,
              arrivalTime,
              duration: '9h 30m',
              availableSeats: 28,
              price: bus.price,
              originalPrice: bus.originalPrice,
              company: bus.company,
              busType: bus.busType,
              rating: bus.rating,
              totalReviews: bus.totalReviews,
              badges: bus.badges,
              seats: generateSeats(),
            });
          });
        }
      }
    }

    await Bus.insertMany(busesToInsert);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    mongoose.connection.close();
  }
}
seedDatabase();
