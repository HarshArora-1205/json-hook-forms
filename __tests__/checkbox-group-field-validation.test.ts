import {
	isValidSchema,
	generateZodSchema,
	SchemaValidationError,
} from "@/utils/schema-validation";

describe("Checkbox-Group Field Tests", () => {
  it("should validate schema for a checkbox-group with valid options and required set to true", () => {
    const validSchema: any = {
      formTitle: "Checkbox-Group Form",
      formDescription: "Test for checkbox-group field",
      fields: [
        {
          id: "interests",
          type: "checkbox-group",
          label: "Interests",
          required: true,
          options: [
            { value: "sports", label: "Sports" },
            { value: "music", label: "Music" },
            { value: "reading", label: "Reading" },
          ],
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Valid data: at least one option selected
    const validData = { interests: ["sports"] };
    expect(() => zodSchema.parse(validData)).not.toThrow();

    // Invalid data: no options selected
    const invalidData = { interests: [] };
    expect(() => zodSchema.parse(invalidData)).toThrow();
  });

  it("should validate schema for a checkbox-group with valid options and required set to false", () => {
    const validSchema: any = {
      formTitle: "Checkbox-Group Form",
      formDescription: "Test for optional checkbox-group field",
      fields: [
        {
          id: "interests",
          type: "checkbox-group",
          label: "Interests",
          required: false,
          options: [
            { value: "sports", label: "Sports" },
            { value: "music", label: "Music" },
            { value: "reading", label: "Reading" },
          ],
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Valid data: no options selected
    const validData = { interests: [] };
    expect(() => zodSchema.parse(validData)).not.toThrow();

    // Valid data: multiple options selected
    const validDataMultiple = { interests: ["sports", "reading"] };
    expect(() => zodSchema.parse(validDataMultiple)).not.toThrow();
  });

  it("should throw error for invalid schema: options missing", () => {
    const invalidSchema: any = {
      formTitle: "Checkbox-Group Form",
      formDescription: "Invalid test for checkbox-group field",
      fields: [
        {
          id: "interests",
          type: "checkbox-group",
          label: "Interests",
          required: true,
          options: [], // Empty options array
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw error for invalid schema: option value not a string", () => {
    const invalidSchema: any = {
      formTitle: "Checkbox-Group Form",
      formDescription: "Invalid test for checkbox-group field",
      fields: [
        {
          id: "interests",
          type: "checkbox-group",
          label: "Interests",
          required: true,
          options: [
            { value: 123, label: "Sports" }, // Invalid value type
            { value: "music", label: "Music" },
          ],
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw error for invalid schema: option label not a string", () => {
    const invalidSchema: any = {
      formTitle: "Checkbox-Group Form",
      formDescription: "Invalid test for checkbox-group field",
      fields: [
        {
          id: "interests",
          type: "checkbox-group",
          label: "Interests",
          required: true,
          options: [
            { value: "sports", label: 123 }, // Invalid label type
            { value: "music", label: "Music" },
          ],
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw error for invalid data: non-array type", () => {
    const validSchema: any = {
      formTitle: "Checkbox-Group Form",
      formDescription: "Test for checkbox-group field",
      fields: [
        {
          id: "interests",
          type: "checkbox-group",
          label: "Interests",
          required: true,
          options: [
            { value: "sports", label: "Sports" },
            { value: "music", label: "Music" },
            { value: "reading", label: "Reading" },
          ],
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Invalid data: non-array type
    const invalidData = { interests: "sports" }; // Should be an array
    expect(() => zodSchema.parse(invalidData)).toThrow();
  });

  it("should throw error for invalid data: values not matching options", () => {
    const validSchema: any = {
      formTitle: "Checkbox-Group Form",
      formDescription: "Test for checkbox-group field",
      fields: [
        {
          id: "interests",
          type: "checkbox-group",
          label: "Interests",
          required: true,
          options: [
            { value: "sports", label: "Sports" },
            { value: "music", label: "Music" },
            { value: "reading", label: "Reading" },
          ],
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Invalid data: values not matching options
    const invalidData = { interests: ["unknown"] }; // `unknown` not in options
    expect(() => zodSchema.parse(invalidData)).toThrow();
  });
});
