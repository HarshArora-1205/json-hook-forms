import {
	isValidSchema,
	generateZodSchema,
	SchemaValidationError,
} from "@/utils/schema-validation";

describe("Textarea Field Tests", () => {
	it("should validate schema for a textarea field with required set to true", () => {
		const validSchema: any = {
			formTitle: "Textarea Field Form",
			formDescription: "Test for textarea field",
			fields: [
				{
					id: "comments",
					type: "textarea",
					label: "Additional Comments",
					required: true,
					placeholder: "Any other details you'd like to share...",
					validation: {
						min: 5,
						max: 200,
						message: "Your comment must be between 5 and 200 characters.",
					},
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);

		// Valid data: comments within the character limit
		const validData = { comments: "This is a valid comment" };
		expect(() => zodSchema.parse(validData)).not.toThrow();

		// Invalid data: comments too short
		const invalidData1 = { comments: "Hey" };
		expect(() => zodSchema.parse(invalidData1)).toThrow();

		// Invalid data: comments too long
		const invalidData2 = { comments: "A".repeat(201) };
		expect(() => zodSchema.parse(invalidData2)).toThrow();
	});

	it("should validate schema for a textarea field with optional validation", () => {
		const validSchema: any = {
			formTitle: "Textarea Field Form",
			formDescription: "Test for optional textarea field",
			fields: [
				{
					id: "comments",
					type: "textarea",
					label: "Additional Comments",
					required: false,
					placeholder: "Any other details you'd like to share...",
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);

		// Valid data: comment field empty (optional field)
		const validData = { comments: "" };
		expect(() => zodSchema.parse(validData)).not.toThrow();

		// Valid data: non-empty comment
		const validData2 = { comments: "I have no comments." };
		expect(() => zodSchema.parse(validData2)).not.toThrow();
	});

	it("should throw error for invalid schema: textarea field with min and max validation issues", () => {
		const invalidSchema: any = {
			formTitle: "Textarea Field Form",
			formDescription: "Test for textarea field with invalid min/max",
			fields: [
				{
					id: "comments",
					type: "textarea",
					label: "Additional Comments",
					required: true,
					validation: {
						min: 10,
						max: 5,
						message: "Comment must be between 5 and 10 characters.",
					},
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).toThrow();
	});

	it("should throw error for invalid schema: textarea field with non-string placeholder", () => {
		const invalidSchema: any = {
			formTitle: "Textarea Field Form",
			formDescription: "Test for textarea field with non-string placeholder",
			fields: [
				{
					id: "comments",
					type: "textarea",
					label: "Additional Comments",
					required: true,
					placeholder: 12345, // Invalid placeholder
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).toThrow();
	});
});
