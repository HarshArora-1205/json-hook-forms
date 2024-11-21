import {
	isValidSchema,
	generateZodSchema,
	SchemaValidationError,
} from "@/utils/schema-validation";

describe("Password Field Tests", () => {
	it("should validate a schema with all properties correctly", () => {
		const validSchema: any = {
			formTitle: "Password Field Form",
			formDescription: "Test for password field",
			fields: [
				{
					id: "password",
					type: "password",
					label: "Password",
					placeholder: "Enter your password",
					required: true,
					validation: {
						pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
						message:
							"Password must be at least 8 characters long and contain at least one letter and one number",
					},
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);

		const validData = { password: "password1" }; // Valid data
		expect(() => zodSchema.parse(validData)).not.toThrow();

		const invalidData = { password: "short" }; // Does not match pattern
		expect(() => zodSchema.parse(invalidData)).toThrow();
	});

	it("should validate a schema without validation rules", () => {
		const validSchema: any = {
			formTitle: "Password Field Form",
			formDescription: "Test for password field",
			fields: [
				{
					id: "password",
					type: "password",
					label: "Password",
					required: false,
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);

		const validData = { password: "" }; // Valid because not required
		expect(() => zodSchema.parse(validData)).not.toThrow();

		const emptyData = {}; // No password field provided
		expect(() => zodSchema.parse(emptyData)).toThrow();
	});

	it("should validate a schema with only the placeholder property", () => {
		const validSchema: any = {
			formTitle: "Password Field Form",
			formDescription: "Test for password field",
			fields: [
				{
					id: "password",
					type: "password",
					label: "Password",
					placeholder: "Enter your password",
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);

		const validData = { password: "samplePass123" }; // Valid data
		expect(() => zodSchema.parse(validData)).not.toThrow();
	});

	it("should throw error for invalid schema with non-string placeholder", () => {
		const invalidSchema: any = {
			formTitle: "Invalid Password Field Form",
			formDescription: "Invalid test for password field",
			fields: [
				{
					id: "password",
					type: "password",
					label: "Password",
					placeholder: 12345, // Invalid placeholder type
					required: true,
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
	});

	it("should throw error for invalid schema with non-string validation pattern", () => {
		const invalidSchema: any = {
			formTitle: "Invalid Password Field Form",
			formDescription: "Invalid test for password field",
			fields: [
				{
					id: "password",
					type: "password",
					label: "Password",
					validation: {
						pattern: 12345, // Invalid pattern type
						message: "Password must meet specific requirements",
					},
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
	});

	it("should validate password with a valid regex pattern", () => {
		const validSchema: any = {
			formTitle: "Password Field Form",
			formDescription: "Test for password field",
			fields: [
				{
					id: "password",
					type: "password",
					label: "Password",
					required: true,
					validation: {
						pattern: "^(?=.*[A-Z])(?=.*\\d).{8,}$", // At least 8 chars, one uppercase, one digit
						message:
							"Password must have at least 8 characters, one uppercase letter, and one digit",
					},
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);
		const validData = { password: "Password1" }; // Matches the pattern
		expect(() => zodSchema.parse(validData)).not.toThrow();

		const invalidData = { password: "password" }; // Missing uppercase and digit
		expect(() => zodSchema.parse(invalidData)).toThrow();
	});

	it("should throw error for missing required password field", () => {
		const validSchema: any = {
			formTitle: "Password Field Form",
			formDescription: "Test for password field",
			fields: [
				{
					id: "password",
					type: "password",
					label: "Password",
					required: true,
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);

		const missingData = {}; // Missing required field
		expect(() => zodSchema.parse(missingData)).toThrow();
	});
});
