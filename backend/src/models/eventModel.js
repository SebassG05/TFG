import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    hasStands: { type: Boolean, required: true },
    img: { type: String, required: true },
    registrationDates: {
        start: { type: Date, required: true },
        end: { type: Date, required: true }
    },
    eventDate: { type: Date, required: true },
    isActive: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

eventSchema.methods.updateIsActive = function() {
    const currentDate = new Date();
    this.isActive = currentDate >= this.registrationDates.start && currentDate <= this.registrationDates.end;
};

eventSchema.pre('save', function(next) {
    this.updateIsActive();
    next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;