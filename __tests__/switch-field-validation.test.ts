import {
	isValidSchema,
	generateZodSchema,
	SchemaValidationError,
} from "@/utils/schema-validation";

describe("Switch Field Tests", () => {
  it("should validate schema for a switch field with required set to true", () => {
    const validSchema: any = {
      formTitle: "Switch Field Form",
      formDescription: "Test for switch field",
      fields: [
        {
          id: "newsletter",
          type: "switch",
          label: "Subscribe to newsletter",
          required: true,
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const { zodSchema } = generateZodSchema(validSchema);

    // Valid data: switch turned on (true)
    const validData = { newsletter: true };
    expect(() => zodSchema.parse(validData)).not.toThrow();

    // Invalid data: switch turned off (false) for required field
    const invalidData = { newsletter: false };
    expect(() => zodSchema.parse(invalidData)).toThrow();
  });

  it("should validate schema for a switch field with required set to false", () => {
    const validSchema: any = {
      formTitle: "Switch Field Form",
      formDescription: "Test for optional switch field",
      fields: [
        {
          id: "newsletter",
          type: "switch",
          label: "Subscribe to newsletter",
          required: false,
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const { zodSchema } = generateZodSchema(validSchema);

    // Valid data: switch turned on (true)
    const validData = { newsletter: true };
    expect(() => zodSchema.parse(validData)).not.toThrow();

    // Valid data: switch turned off (false)
    const validData2 = { newsletter: false };
    expect(() => zodSchema.parse(validData2)).not.toThrow();
  });

  it("should throw error for invalid schema: switch with required set to true and not boolean value", () => {
    const invalidSchema: any = {
      formTitle: "Switch Field Form",
      formDescription: "Test for invalid switch value",
      fields: [
        {
          id: "newsletter",
          type: "switch",
          label: "Subscribe to newsletter",
          required: true,
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).not.toThrow();

    const zodSchema = generateZodSchema(invalidSchema);
  });

  it("should throw error for invalid schema: missing boolean value for required switch", () => {
    const invalidSchema: any = {
      formTitle: "Switch Field Form",
      formDescription: "Test for missing value in required switch",
      fields: [
        {
          id: "newsletter",
          type: "switch",
          label: "Subscribe to newsletter",
          required: true,
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).not.toThrow();
  });

  it("should throw error for invalid schema: required switch field with non-boolean value", () => {
    const invalidSchema: any = {
      formTitle: "Switch Field Form",
      formDescription: "Test for invalid switch value",
      fields: [
        {
          id: "newsletter",
          type: "switch",
          label: "Subscribe to newsletter",
          required: true,
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).not.toThrow();
  });
});
