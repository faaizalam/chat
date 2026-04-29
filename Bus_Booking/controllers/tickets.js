import Bus from '../model/bus.js';
import Ticket from '../model/ticket.js';
import User from '../model/user.js';
import { v4 as uuidv4 } from 'uuid';

export const getUserTickets = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }


  console.log("hello");
    //
    const tickets = await Ticket.find({ user: userId })
      .populate('bus', 'busId from to company departureTime arrivalTime price')
      .sort({ bookedAt: -1 });
    res.status(200).json({ tickets: tickets || [] });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const bookTicket = async (req, res) => {
  try {
    const userId = req.userId;
    const { busId, date, seatNumbers } = req.body;
    if (
      !busId ||
      !date ||
      !seatNumbers ||
      !Array.isArray(seatNumbers) ||
      seatNumbers.length === 0
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const targetDate = new Date(date);

    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (targetDate.getTime() < Date.now()) {
      return res.status(400).json({ message: 'Cannot book for past dates' });
    }
    const bus = await Bus.findOne({ busId: busId });
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const unavailableSeats = seatNumbers.filter(seatNum => {
      return bus.seats.some(seat => seat.seat_id === seatNum && seat.booked);
    });
    if (unavailableSeats.length > 0) {
      return res
        .status(400)
        .json({ message: 'Some seats are already booked', unavailableSeats });
    }

    const totalFare = seatNumbers.length * bus.price;

    const ticket = new Ticket({
      user: userId,
      bus: bus._id,
      date: targetDate,
      seatNumbers,
      total_fare: totalFare,
      pnr: uuidv4().slice(0, 10).toUpperCase(),
    });
    bus.seats.forEach(seat => {
      if (seatNumbers.includes(seat.seat_id)) {
        seat.booked = true;
      }
    });
    await bus.save();
    await ticket.save();
    res.status(201).json({ message: 'Ticket booked successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
