const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
    events: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Not authenticated');
            }
            const events = await Event.find().populate('creator');
            return events.map(event => 
                transformEvent(event)
            );
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error('Not authenticated');
            }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: req.userId
            });
                
            const result = await event.save();
            let createdEvent = transformEvent(result);
            const myUser = await User.findById('63af487da5de32dac85f1cab')
            if (!myUser) {
                throw new Error ('User does not exist');
            }
            myUser.createdEvents.push(event);
            await myUser.save();
            return createdEvent;
        } catch (err) {
            throw err;
        }
    }
}
