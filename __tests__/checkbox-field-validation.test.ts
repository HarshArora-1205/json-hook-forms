import {
	isValidSchema,
	generateZodSchema,
	SchemaValidationError,
} from "@/utils/schema-validation";

describe("Checkbox Field Tests", () => {
  it("should validate schema for a required checkbox", () => {
    const validSchema: any = {
      formTitle: "Checkbox Field Form",
      formDescription: "Test for checkbox field",
      fields: [
        {
          id: "agree",
          type: "checkbox",
          label: "Do you agree?",
          required: true,
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Valid data: checkbox checked
    const validData = { agree: true };
    expect(() => zodSchema.parse(validData)).not.toThrow();

    // Invalid data: checkbox not checked
    const invalidData = { agree: false };
    expect(() => zodSchema.parse(invalidData)).toThrow();
  });

  it("should validate schema for an optional checkbox", () => {
    const validSchema: any = {
      formTitle: "Checkbox Field Form",
      formDescription: "Test for optional checkbox field",
      fields: [
        {
          id: "subscribe",
          type: "checkbox",
          label: "Subscribe to newsletter",
          required: false,
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Valid data: checkbox checked
    const validDataChecked = { subscribe: true };
    expect(() => zodSchema.parse(validDataChecked)).not.toThrow();

    // Valid data: checkbox not checked
    const validDataUnchecked = { subscribe: false };
    expect(() => zodSchema.parse(validDataUnchecked)).not.toThrow();
  });

  it("should validate schema for a checkbox with no `required` specified", () => {
    const validSchema: any = {
      formTitle: "Checkbox Field Form",
      formDescription: "Test for checkbox field without required flag",
      fields: [
        {
          id: "agree",
          type: "checkbox",
          label: "Do you agree?",
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Valid data: checkbox checked
    const validDataChecked = { agree: true };
    expect(() => zodSchema.parse(validDataChecked)).not.toThrow();

    // Valid data: checkbox not checked
    const validDataUnchecked = { agree: false };
    expect(() => zodSchema.parse(validDataUnchecked)).not.toThrow();
  });
});
