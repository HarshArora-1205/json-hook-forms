import {
	isValidSchema,
	generateZodSchema,
	SchemaValidationError,
} from "@/utils/schema-validation";

describe("Text Field Tests", () => {
	it("should be valid schema", () => {
		const validSchema: any = {
			formTitle: "Text Field Form",
			formDescription: "Test for text field",
			fields: [
				{
					id: "name",
					type: "text",
					label: "Name",
					required: true,
					validation: { min: 3, max: 20 },
				},
			],
		};
		expect(() => isValidSchema(validSchema)).not.toThrow();

		const zodSchema = generateZodSchema(validSchema);
		const validData = { name: "Alice" }; // Valid data
		expect(() => zodSchema.parse(validData)).not.toThrow();

		let invalidData = { name: "Al" }; // Too short
		expect(() => zodSchema.parse(invalidData)).toThrow();

		invalidData = { name: "Alice Baal Bhattacharya" }; // Too long
		expect(() => zodSchema.parse(invalidData)).toThrow();
	});

	it("should be valid schema", () => {
		const validSchema: any = {
			formTitle: "Text Field Form",
			formDescription: "Test for text field",
			fields: [
				{
					id: "name",
					type: "text",
					label: "Name",
					required: false,
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const zodSchema = generateZodSchema(validSchema);
		const validData = { name: "" }; // Valid because not required
		expect(() => zodSchema.parse(validData)).not.toThrow();

		const invalidData = {}; // No data provided
		expect(() => zodSchema.parse(invalidData)).not.toThrow(); // Still valid
	});

	it("should be valid schema", () => {
		const validSchema: any = {
			formTitle: "Text Field Form",
			formDescription: "Test for text field",
			fields: [
				{
					id: "name",
					type: "text",
					label: "Name",
					required: false,
					validation: {
						min: 3,
						max: 20,
						message: "Minimum 3 chars, Maximum 20 chars",
					},
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const zodSchema = generateZodSchema(validSchema);
		const validData = { name: "John Doe" }; // Valid data
		expect(() => zodSchema.parse(validData)).not.toThrow();

		const invalidData = { name: "Hi" }; // Too short
		expect(() => zodSchema.parse(invalidData)).toThrow();
	});

	it("should be valid schema", () => {
		const validSchema: any = {
			formTitle: "Text Field Form",
			formDescription: "Test for text field",
			fields: [
				{
					id: "name",
					type: "text",
					label: "Name",
					placeholder: "Hello",
					required: false,
					validation: { min: 3, message: "Minimum 3 chars" },
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const zodSchema = generateZodSchema(validSchema);
		const validData = { name: "Hello World" }; // Valid data
		expect(() => zodSchema.parse(validData)).not.toThrow();

		let invalidData = { name: "Hi" }; // Too short
		expect(() => zodSchema.parse(invalidData)).toThrow();

		invalidData = { name: "" }; // Even though required is false, min criteria makes it required
		expect(() => zodSchema.parse(invalidData)).toThrow();
	});

	it("should be valid schema", () => {
		const validSchema: any = {
			formTitle: "Text Field Form",
			formDescription: "Test for text field",
			fields: [
				{
					id: "name",
					type: "text",
					label: "Name",
					required: false,
					validation: { max: 20, message: "Maximum 20 chars" },
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const zodSchema = generateZodSchema(validSchema);
		let validData = { name: "Short Name" }; // Valid data
		expect(() => zodSchema.parse(validData)).not.toThrow();

		validData = { name: "" }; // Valid data
		expect(() => zodSchema.parse(validData)).not.toThrow();

		const invalidData = { name: "This name is way too long to be valid" }; // Too long
		expect(() => zodSchema.parse(invalidData)).toThrow();
	});

	it("should throw error for invalid schema with min > max", () => {
		const invalidSchema: any = {
			formTitle: "Invalid Text Field Form",
			formDescription: "Invalid test for text field",
			fields: [
				{
					id: "name",
					type: "text",
					label: "Name",
					required: true,
					validation: { min: 23, max: 2 },
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
	});

	it("should throw error for invalid schema with placeholder not a string", () => {
		const invalidSchema: any = {
			formTitle: "Invalid Text Field Form",
			formDescription: "Invalid test for text field",
			fields: [
				{
					id: "name",
					type: "text",
					label: "Name",
					placeholder: 43, // Invalid type
					required: true,
					validation: { min: 23, max: 29 },
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
	});
});
