import {
	isValidSchema,
	generateZodSchema,
	SchemaValidationError,
} from "@/utils/schema-validation";

describe("Range Field Tests", () => {
  it("should validate schema for a range field with valid min, max, and step values", () => {
    const validSchema: any = {
      formTitle: "Range Field Form",
      formDescription: "Test for range field",
      fields: [
        {
          id: "rating",
          type: "range",
          label: "Rating",
          required: true,
          validation: {
            min: 1,
            max: 5,
            step: 1,
            message: "Invalid rating",
          },
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const { zodSchema } = generateZodSchema(validSchema);
    
    // Valid data: rating within range and step
    const validData = { rating: 3 };
    expect(() => zodSchema.parse(validData)).not.toThrow();

    // Invalid data: rating less than min value
    const invalidData = { rating: 0 };
    expect(() => zodSchema.parse(invalidData)).toThrow();

    // Invalid data: rating greater than max value
    const invalidData2 = { rating: 6 };
    expect(() => zodSchema.parse(invalidData2)).toThrow();

    // Invalid data: rating not a multiple of step
    const invalidData3 = { rating: 2.5 }; // not a multiple of step 1
    expect(() => zodSchema.parse(invalidData3)).toThrow();
  });

  it("should validate schema for a range field with min and max values but no step", () => {
    const validSchema: any = {
      formTitle: "Range Field Form",
      formDescription: "Test for range field",
      fields: [
        {
          id: "rating",
          type: "range",
          label: "Rating",
          required: true,
          validation: {
            min: 1,
            max: 5,
            message: "Invalid rating",
          },
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();

    const { zodSchema } = generateZodSchema(validSchema);
    
    // Valid data: rating within range
    const validData = { rating: 3 };
    expect(() => zodSchema.parse(validData)).not.toThrow();

    // Invalid data: rating less than min value
    const invalidData = { rating: 0 };
    expect(() => zodSchema.parse(invalidData)).toThrow();

    // Invalid data: rating greater than max value
    const invalidData2 = { rating: 6 };
    expect(() => zodSchema.parse(invalidData2)).toThrow();
  });

  it("should throw error for invalid schema: missing min or max values", () => {
    const invalidSchema: any = {
      formTitle: "Range Field Form",
      formDescription: "Test for missing min/max",
      fields: [
        {
          id: "rating",
          type: "range",
          label: "Rating",
          required: true,
          validation: {
            step: 1,
          },
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw error for invalid schema: non-numeric min or max", () => {
    const invalidSchema: any = {
      formTitle: "Range Field Form",
      formDescription: "Test for non-numeric min/max",
      fields: [
        {
          id: "rating",
          type: "range",
          label: "Rating",
          required: true,
          validation: {
            min: "1", // non-numeric min
            max: 5,
          },
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw error for invalid schema: step not a number", () => {
    const invalidSchema: any = {
      formTitle: "Range Field Form",
      formDescription: "Test for non-numeric step",
      fields: [
        {
          id: "rating",
          type: "range",
          label: "Rating",
          required: true,
          validation: {
            min: 1,
            max: 5,
            step: "1", // non-numeric step
          },
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw error for invalid schema: max value less than min value", () => {
    const invalidSchema: any = {
      formTitle: "Range Field Form",
      formDescription: "Test for invalid max < min",
      fields: [
        {
          id: "rating",
          type: "range",
          label: "Rating",
          required: true,
          validation: {
            min: 5,
            max: 1, // invalid max < min
          },
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw error for invalid schema: non-string validation message", () => {
    const invalidSchema: any = {
      formTitle: "Range Field Form",
      formDescription: "Test for non-string message",
      fields: [
        {
          id: "rating",
          type: "range",
          label: "Rating",
          required: true,
          validation: {
            min: 1,
            max: 5,
            step: 1,
            message: 123, // invalid non-string message
          },
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });
});
