import {
	isValidSchema,
	generateZodSchema,
	SchemaValidationError,
} from "@/utils/schema-validation";

describe("Select Field Tests", () => {
	it("should validate schema for a select field with required set to true", () => {
		const validSchema: any = {
			formTitle: "Select Field Form",
			formDescription: "Test for select field",
			fields: [
				{
					id: "companySize",
					type: "select",
					label: "Company Size",
					required: true,
					options: [
						{ value: "1-50", label: "1-50 employees" },
						{ value: "51-200", label: "51-200 employees" },
						{ value: "201-1000", label: "201-1000 employees" },
						{ value: "1000+", label: "1000+ employees" },
					],
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);

		// Valid data: selecting a valid option
		const validData = { companySize: "1-50" };
		expect(() => zodSchema.parse(validData)).not.toThrow();

		// Invalid data: selecting an invalid option
		const invalidData = { companySize: "5000" }; // Not in options
		expect(() => zodSchema.parse(invalidData)).toThrow();
	});

	it("should validate schema for a select field with required set to false", () => {
		const validSchema: any = {
			formTitle: "Select Field Form",
			formDescription: "Test for optional select field",
			fields: [
				{
					id: "companySize",
					type: "select",
					label: "Company Size",
					required: false,
					options: [
						{ value: "1-50", label: "1-50 employees" },
						{ value: "51-200", label: "51-200 employees" },
						{ value: "201-1000", label: "201-1000 employees" },
						{ value: "1000+", label: "1000+ employees" },
					],
				},
			],
		};

		expect(() => isValidSchema(validSchema)).not.toThrow();

		const { zodSchema } = generateZodSchema(validSchema);

		// Valid data: selecting a valid option
		const validData = { companySize: "51-200" };
		expect(() => zodSchema.parse(validData)).not.toThrow();

		// Valid data: selecting an empty value (since required is false)
		const validData2 = { companySize: "" };
		expect(() => zodSchema.parse(validData2)).not.toThrow();
	});

	it("should throw error for invalid schema: select field with empty options array", () => {
		const invalidSchema: any = {
			formTitle: "Select Field Form",
			formDescription: "Test for select field with empty options",
			fields: [
				{
					id: "companySize",
					type: "select",
					label: "Company Size",
					required: true,
					options: [],
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).toThrow();
	});

	it("should throw error for invalid schema: select field with non-object options", () => {
		const invalidSchema: any = {
			formTitle: "Select Field Form",
			formDescription: "Test for select field with invalid option structure",
			fields: [
				{
					id: "companySize",
					type: "select",
					label: "Company Size",
					required: true,
					options: [
						{ value: "1-50", label: "1-50 employees" },
						{ value: 100, label: "100 employees" }, // Invalid value type
					],
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).toThrow();
	});

	it("should throw error for invalid schema: select field with non-string option value", () => {
		const invalidSchema: any = {
			formTitle: "Select Field Form",
			formDescription:
				"Test for select field with invalid value type in options",
			fields: [
				{
					id: "companySize",
					type: "select",
					label: "Company Size",
					required: true,
					options: [
						{ value: "1-50", label: "1-50 employees" },
						{ value: "51-200", label: "51-200 employees" },
						{ value: 201, label: "201 employees" }, // Invalid value type
					],
				},
			],
		};

		expect(() => isValidSchema(invalidSchema)).toThrow();
	});
});
