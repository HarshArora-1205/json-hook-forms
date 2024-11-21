import {
	isValidSchema,
	generateZodSchema,
	SchemaValidationError,
} from "@/utils/schema-validation";

describe("Email Field Tests", () => {
	it("should be valid schema with required email field", () => {
		const validSchema: any = {
			formTitle: "Email Field Form",
			formDescription: "Test for email field",
			fields: [
				{
					id: "email",
					type: "email",
					label: "Email",
					required: true,
					validation: { message: "Must be a valid email address" },
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);
		const validData = { email: "test@example.com" }; // Valid email
		expect(() => zodSchema.parse(validData)).not.toThrow();

		const invalidData = { email: "invalid-email" }; // Invalid email
		expect(() => zodSchema.parse(invalidData)).toThrow();
	});

	it("should be valid schema with required custom regex", () => {
		const validSchema: any = {
			formTitle: "Email Field Form",
			formDescription: "Test for email field",
			fields: [
				{
					id: "email",
					type: "email",
					label: "Email",
					required: true,
					validation: {
						pattern: "^[a-zA-Z0-9._%+-]+@outlook\\.com$",
						message: "Only Outlook email addresses are allowed",
					},
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);
		const validData = { email: "test@outlook.com" }; // Valid email
		expect(() => zodSchema.parse(validData)).not.toThrow();

		let invalidData = { email: "invalid@gmail.com" }; // Invalid email
		expect(() => zodSchema.parse(invalidData)).toThrow();

		invalidData = { email: "" }; // Empty not allowed
		expect(() => zodSchema.parse(invalidData)).toThrow();
	});

	it("should be valid schema with optional email field", () => {
		const validSchema: any = {
			formTitle: "Optional Email Field Form",
			formDescription: "Test for optional email field",
			fields: [
				{
					id: "email",
					type: "email",
					label: "Email",
					required: false,
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);
		const validData = { email: "" }; // Valid because not required
		expect(() => zodSchema.parse(validData)).not.toThrow();

		const invalidData = {}; // No email provided, actually not possible
		expect(() => zodSchema.parse(invalidData)).toThrow();
	});

	it("should validate email with custom message", () => {
		const validSchema: any = {
			formTitle: "Email Field Form with Custom Message",
			formDescription: "Test for email field with custom validation message",
			fields: [
				{
					id: "email",
					type: "email",
					label: "Email",
					required: true,
					validation: { message: "Invalid email format" },
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);
		const validData = { email: "valid.email@domain.com" }; // Valid email
		expect(() => zodSchema.parse(validData)).not.toThrow();

		const invalidData = { email: "bademail" }; // Invalid email
		expect(() => zodSchema.parse(invalidData)).toThrow();
	});

	it("should throw error for invalid schema with placeholder not a string", () => {
		const invalidSchema: any = {
			formTitle: "Invalid Email Field Form",
			formDescription: "Invalid test for email field",
			fields: [
				{
					id: "email",
					type: "email",
					label: "Email",
					placeholder: 123, // Invalid type
					required: true,
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
	});

	it("should throw error for invalid schema with invalid validation object", () => {
		const invalidSchema: any = {
			formTitle: "Invalid Email Field Form",
			formDescription: "Invalid test for email field",
			fields: [
				{
					id: "email",
					type: "email",
					label: "Email",
					required: true,
					validation: { pattern: "invalid-regex" }, // valid regex, but its invalid for an email, user mistake
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).not.toThrow(
			SchemaValidationError
		);
	});

	it("should throw error for invalid schema with invalid validation object", () => {
		const invalidSchema: any = {
			formTitle: "Invalid Email Field Form",
			formDescription: "Invalid test for email field",
			fields: [
				{
					id: "email",
					type: "email",
					label: "Email",
					required: true,
					validation: { message: 34 }, // Invalid message type
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
	});
});
