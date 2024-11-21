import {
	isValidSchema,
	generateZodSchema,
	SchemaValidationError,
} from "@/utils/schema-validation";

describe("Number Field Tests", () => {
	it("should validate schema with all properties correctly", () => {
		const validSchema: any = {
			formTitle: "Number Field Form",
			formDescription: "Test for number field",
			fields: [
				{
					id: "age",
					type: "number",
					label: "Age",
					placeholder: "Enter your age",
					required: true,
					validation: {
						min: 0,
						max: 120,
						step: 1,
						message: "Value must be between 0 and 120 and a multiple of 1",
					},
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);

		// Valid data
		const validData = { age: 25 };
		expect(() => zodSchema.parse(validData)).not.toThrow();

		// Invalid data: less than min
		const invalidDataMin = { age: -1 };
		expect(() => zodSchema.parse(invalidDataMin)).toThrow();

		// Invalid data: greater than max
		const invalidDataMax = { age: 130 };
		expect(() => zodSchema.parse(invalidDataMax)).toThrow();

		// Invalid data: not a multiple of step
		const invalidDataStep = { age: 25.5 };
		expect(() => zodSchema.parse(invalidDataStep)).toThrow();
	});

	it("should validate schema without optional properties", () => {
		const validSchema: any = {
			formTitle: "Number Field Form",
			formDescription: "Test for number field",
			fields: [
				{
					id: "age",
					type: "number",
					label: "Age",
					required: false,
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);

		// Valid data: number provided
		const validData = { age: 30 };
		expect(() => zodSchema.parse(validData)).not.toThrow();

		// Valid data: field omitted
		const emptyData = {};
		expect(() => zodSchema.parse(emptyData)).not.toThrow();
	});

	it("should throw error for invalid schema: min > max", () => {
		const invalidSchema: any = {
			formTitle: "Invalid Number Field Form",
			formDescription: "Invalid test for number field",
			fields: [
				{
					id: "age",
					type: "number",
					label: "Age",
					validation: {
						min: 120,
						max: 0,
					},
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
	});

	it("should throw error for invalid schema: min is not a number", () => {
		const invalidSchema: any = {
			formTitle: "Invalid Number Field Form",
			formDescription: "Invalid test for number field",
			fields: [
				{
					id: "age",
					type: "number",
					label: "Age",
					validation: {
						min: "0", // Invalid min type
						max: 120,
					},
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
	});

	it("should throw error for invalid schema: step is not a number", () => {
		const invalidSchema: any = {
			formTitle: "Invalid Number Field Form",
			formDescription: "Invalid test for number field",
			fields: [
				{
					id: "age",
					type: "number",
					label: "Age",
					validation: {
						min: 0,
						max: 120,
						step: "1", // Invalid step type
					},
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
	});

	it("should validate range with only max constraint", () => {
		const validSchema: any = {
			formTitle: "Number Field Form",
			formDescription: "Test for number field",
			fields: [
				{
					id: "age",
					type: "number",
					label: "Age",
					required: true,
					validation: {
						max: 50,
						message: "Value must be less than or equal to 50",
					},
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);

		// Valid data: within max limit
		const validData = { age: 45 };
		expect(() => zodSchema.parse(validData)).not.toThrow();

		// Invalid data: exceeds max limit
		const invalidData = { age: 51 };
		expect(() => zodSchema.parse(invalidData)).toThrow();
	});

	it("should validate range with only min constraint", () => {
		const validSchema: any = {
			formTitle: "Number Field Form",
			formDescription: "Test for number field",
			fields: [
				{
					id: "age",
					type: "number",
					label: "Age",
					required: true,
					validation: {
						min: 18,
						message: "Value must be at least 18",
					},
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);

		// Valid data: above min limit
		const validData = { age: 20 };
		expect(() => zodSchema.parse(validData)).not.toThrow();

		// Invalid data: below min limit
		const invalidData = { age: 16 };
		expect(() => zodSchema.parse(invalidData)).toThrow();
	});
});
