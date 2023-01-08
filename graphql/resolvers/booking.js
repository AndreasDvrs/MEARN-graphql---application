const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { user, transformBooking } = require('./merge');

module.exports = {
    bookings: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Not authenticated');
            }
            const bookings = await Booking.find({user: req.userId});
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Not authenticated');
        }
        const fetchedEvent = await Event.findOne({_id: args.eventId})
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
        });
        const result = await booking.save();        
        return transformBooking(result);
    },
    cancelBooking: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Not authenticated');
            }
            const foundBooking = await Booking.findById(args.bookingId).populate('event');
            const event = {
                ...foundBooking.event._doc,
                _id: foundBooking.id,
                creator: user.bind(this, foundBooking.event._doc.creator)
            };
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (err) {
            throw err;
        }
            
    }
}
