import {
	isValidSchema,
	generateZodSchema,
	SchemaValidationError,
} from "@/utils/schema-validation";

describe("Telephone Field Tests", () => {
  it("should validate schema with default 10-digit pattern", () => {
    const validSchema: any = {
      formTitle: "Telephone Field Form",
      formDescription: "Test for telephone field",
      fields: [
        {
          id: "phone",
          type: "tel",
          label: "Phone Number",
          required: true,
          placeholder: "Enter your phone number",
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Valid data: 10-digit number
    const validData = { phone: "1234567890" };
    expect(() => zodSchema.parse(validData)).not.toThrow();

    // Invalid data: less than 10 digits
    const invalidDataShort = { phone: "12345" };
    expect(() => zodSchema.parse(invalidDataShort)).toThrow();

    // Invalid data: more than 10 digits
    const invalidDataLong = { phone: "123456789012" };
    expect(() => zodSchema.parse(invalidDataLong)).toThrow();

    // Invalid data: contains letters
    const invalidDataLetters = { phone: "12345abcd0" };
    expect(() => zodSchema.parse(invalidDataLetters)).toThrow();
  });

  it("should validate schema with custom pattern", () => {
    const validSchema: any = {
      formTitle: "Telephone Field Form",
      formDescription: "Test for telephone field",
      fields: [
        {
          id: "phone",
          type: "tel",
          label: "Phone Number",
          required: true,
          validation: {
            pattern: "^[+]?[1-9]\\d{1,14}$",
            message: "Invalid international phone number format",
          },
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Valid data: international format
    const validData = { phone: "+1234567890" };
    expect(() => zodSchema.parse(validData)).not.toThrow();

    // Invalid data: missing "+" for international number
    // const invalidDataMissingPlus = { phone: "1234567890" };
    // expect(() => zodSchema.parse(invalidDataMissingPlus)).toThrow();
  });

  it("should throw error for invalid schema: pattern is not a string", () => {
    const invalidSchema: any = {
      formTitle: "Invalid Telephone Field Form",
      formDescription: "Invalid test for telephone field",
      fields: [
        {
          id: "phone",
          type: "tel",
          label: "Phone Number",
          required: true,
          validation: {
            pattern: 123456, // Invalid type
          },
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw error for invalid schema: pattern is not valid regex", () => {
    const invalidSchema: any = {
      formTitle: "Invalid Telephone Field Form",
      formDescription: "Invalid test for telephone field",
      fields: [
        {
          id: "phone",
          type: "tel",
          label: "Phone Number",
          required: true,
          validation: {
            pattern: "[unclosed(", // Invalid regex
          },
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw error for invalid schema: placeholder is not a string", () => {
    const invalidSchema: any = {
      formTitle: "Invalid Telephone Field Form",
      formDescription: "Invalid test for telephone field",
      fields: [
        {
          id: "phone",
          type: "tel",
          label: "Phone Number",
          placeholder: 12345, // Invalid type
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should validate optional telephone field", () => {
    const validSchema: any = {
      formTitle: "Telephone Field Form",
      formDescription: "Test for optional telephone field",
      fields: [
        {
          id: "phone",
          type: "tel",
          label: "Phone Number",
          required: false,
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Valid data: number provided
    const validData = { phone: "9876543210" };
    expect(() => zodSchema.parse(validData)).not.toThrow();

    // Valid data: field omitted
    const validDataEmpty = { phone: "" };
    expect(() => zodSchema.parse(validDataEmpty)).not.toThrow();
  });

  it("should validate schema with custom validation message", () => {
    const validSchema: any = {
      formTitle: "Telephone Field Form",
      formDescription: "Test for telephone field with custom validation",
      fields: [
        {
          id: "phone",
          type: "tel",
          label: "Phone Number",
          required: true,
          validation: {
            pattern: "^\\d{10}$",
            message: "Phone number must exactly be 10 digits long",
          },
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const zodSchema = generateZodSchema(validSchema);

    // Valid data: 10-digit number
    const validData = { phone: "1234567890" };
    expect(() => zodSchema.parse(validData)).not.toThrow();

    // Invalid data: 8 digits
    const invalidData = { phone: "12345678" };
    expect(() => zodSchema.parse(invalidData)).toThrowError(
      "Phone number must exactly be 10 digits long"
    );
  });
});