import {
	isValidSchema,
	generateZodSchema,
	SchemaValidationError,
} from "@/utils/schema-validation";

describe("Radio Field Tests", () => {
  it("should validate schema for a radio field with valid options and required set to true", () => {
    const validSchema: any = {
      formTitle: "Radio Field Form",
      formDescription: "Test for radio field",
      fields: [
        {
          id: "industry",
          type: "radio",
          label: "Industry",
          required: true,
          options: [
            { value: "tech", label: "Technology" },
            { value: "healthcare", label: "Healthcare" },
            { value: "finance", label: "Finance" },
            { value: "retail", label: "Retail" },
            { value: "other", label: "Other" },
          ],
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Valid data: one option selected
    const validData = { industry: "tech" };
    expect(() => zodSchema.parse(validData)).not.toThrow();

    // Invalid data: no option selected
    const invalidData = { industry: "" };
    expect(() => zodSchema.parse(invalidData)).toThrow();
  });

  it("should validate schema for a radio field with valid options and required set to false", () => {
    const validSchema: any = {
      formTitle: "Radio Field Form",
      formDescription: "Test for optional radio field",
      fields: [
        {
          id: "industry",
          type: "radio",
          label: "Industry",
          required: false,
          options: [
            { value: "tech", label: "Technology" },
            { value: "healthcare", label: "Healthcare" },
            { value: "finance", label: "Finance" },
            { value: "retail", label: "Retail" },
            { value: "other", label: "Other" },
          ],
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Valid data: one option selected
    const validData = { industry: "finance" };
    expect(() => zodSchema.parse(validData)).not.toThrow();

    // Valid data: no option selected
    const validEmptyData = { industry: "" };
    expect(() => zodSchema.parse(validEmptyData)).not.toThrow();
  });

  it("should throw error for invalid schema: options missing or empty", () => {
    const invalidSchema: any = {
      formTitle: "Radio Field Form",
      formDescription: "Invalid test for radio field",
      fields: [
        {
          id: "industry",
          type: "radio",
          label: "Industry",
          required: true,
          options: [], // Empty options array
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw error for invalid schema: option value not a string", () => {
    const invalidSchema: any = {
      formTitle: "Radio Field Form",
      formDescription: "Invalid test for radio field",
      fields: [
        {
          id: "industry",
          type: "radio",
          label: "Industry",
          required: true,
          options: [
            { value: 123, label: "Technology" }, // Invalid value type
            { value: "healthcare", label: "Healthcare" },
          ],
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw error for invalid schema: option label not a string", () => {
    const invalidSchema: any = {
      formTitle: "Radio Field Form",
      formDescription: "Invalid test for radio field",
      fields: [
        {
          id: "industry",
          type: "radio",
          label: "Industry",
          required: true,
          options: [
            { value: "tech", label: 123 }, // Invalid label type
            { value: "healthcare", label: "Healthcare" },
          ],
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw error for invalid data: selected value not in options", () => {
    const validSchema: any = {
      formTitle: "Radio Field Form",
      formDescription: "Test for radio field",
      fields: [
        {
          id: "industry",
          type: "radio",
          label: "Industry",
          required: true,
          options: [
            { value: "tech", label: "Technology" },
            { value: "healthcare", label: "Healthcare" },
            { value: "finance", label: "Finance" },
            { value: "retail", label: "Retail" },
            { value: "other", label: "Other" },
          ],
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Invalid data: selected value not in options
    const invalidData = { industry: "invalid" }; // `invalid` not in options
    expect(() => zodSchema.parse(invalidData)).toThrow();
  });

  it("should throw error for invalid data: non-string value", () => {
    const validSchema: any = {
      formTitle: "Radio Field Form",
      formDescription: "Test for radio field",
      fields: [
        {
          id: "industry",
          type: "radio",
          label: "Industry",
          required: true,
          options: [
            { value: "tech", label: "Technology" },
            { value: "healthcare", label: "Healthcare" },
            { value: "finance", label: "Finance" },
            { value: "retail", label: "Retail" },
            { value: "other", label: "Other" },
          ],
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Invalid data: non-string value
    const invalidData = { industry: 123 }; // Should be a string
    expect(() => zodSchema.parse(invalidData)).toThrow();
  });
});
