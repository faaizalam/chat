import Bus from '../model/bus.js';

export const getBusDetails = async (req, res) => {
  try {
    // Fetch bus details from the database (replace with actual DB call)

    const { busId } = req.params;

    if (!busId) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        busId: bus.busId,
        from: bus.from,
        to: bus.to,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        duration: bus.duration,
        availableSeats: bus.availableSeats,
        price: bus.price,
        originalPrice: bus.originalPrice,
        company: bus.company,
        busType: bus.busType,
        rating: bus.rating,
        totalReviews: bus.totalReviews,
        badges: bus.badges,
        seats: bus.seats,
      },
    });
  } catch (error) {
    console.error('Error fetching bus details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchBuses = async (req, res) => {
  try {
    const { from, to, date } = req.body;
    if (!from || !to || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const requestedDateAndTime = new Date(date);
    if (isNaN(requestedDateAndTime.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    const curentDate = Date.now();
    if (requestedDateAndTime.getTime() < curentDate) {
      return res.status(400).json({ message: 'Date must be in the future' });
    }

    const startTime = new Date(
      Date.UTC(
        requestedDateAndTime.getUTCFullYear(),
        requestedDateAndTime.getUTCMonth(),
        requestedDateAndTime.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );

    const endTime = new Date(
      Date.UTC(
        requestedDateAndTime.getUTCFullYear(),
        requestedDateAndTime.getUTCMonth(),
        requestedDateAndTime.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );
    const buses = await Bus.find({
      from: from,
      to: to,
      departureTime: { $gte: startTime, $lte: endTime },
    });
    res.status(200).json({
      success: true,
      data: buses,
    });
  } catch (error) {
    console.error('Error searching for buses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
