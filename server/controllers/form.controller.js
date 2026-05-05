import CourseRegistration from "../model/form.model.js";

export const registerCourse = async (req, res) => {
	try {
		const { name, email, contact, organisation, registrationDate, status } = req.body;
		if (!name || !email || !contact || !organisation) {
			return res.status(400).json({ error: "All fields are required." });
		}

		// Check if already registered by email
		const existing = await CourseRegistration.findOne({ email });
		if (existing) {
			return res.status(409).json({ error: "You have already registered with this email." });
		}

		const registration = new CourseRegistration({
			name,
			email,
			contact,
			organisation,
			registrationDate,
			status
		});
		await registration.save();
		res.status(201).json({ message: "Registration successful", registration });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error. Please try again later." });
	}
};
