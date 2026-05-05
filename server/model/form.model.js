import mongoose from "mongoose";

const courseRegistrationSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	contact: { type: String, required: true },
	organisation: { type: String, required: true },
	registrationDate: { type: Date, default: Date.now },
	status: { type: String, default: 'pending' }
});

const CourseRegistration = mongoose.models.CourseRegistration || mongoose.model('CourseRegistration', courseRegistrationSchema);

export default CourseRegistration;
