const DataLoader = require('dataloader');
const { dateToString } = require('../../helpers/date');
const Event = require('../../models/event');
const User = require('../../models/user');

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
    return User.find({_id: {$in: userIds}});
});

const singleEvent = async eventId => {
    try {
        const event = await eventLoader.load(eventId.toString());
        return event;
    } catch (err) {
        throw err;
    }
}

const user = async (userId) => {
    try {
        const myUser =  await userLoader.load(userId);
        return {
            ...myUser._doc, 
            _id: myUser.id, 
            createdEvents: () => eventLoader.loadMany(myUser._doc.createdEvents)
        }
    } catch (err) {
        throw err;
    }
}

const events = async (eventIds) => {
    try {
        const events = await Event.find({
            _id: {$in: eventIds}
        });
        events.sort((a,b) => {
            return eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString());
        })
        const updatedEvents = events.map(event => {
            return transformEvent(event)
        });
        return updatedEvents;
    } catch (err) {
        throw err;
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc, 
        _id: booking.id, 
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    };
}

const transformEvent = (event) => {
    return {
        ...event._doc, 
        _id: event.id, 
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}

exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
