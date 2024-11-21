import {
	isValidSchema,
	generateZodSchema,
	SchemaValidationError,
} from "@/utils/schema-validation";
import { Schema } from "@/types/schema";
import { z } from "zod";

describe("isValidSchema", () => {
  it("should validate a correct schema", () => {
    const validSchema = {
      formTitle: "Valid Form",
      formDescription: "This is a valid form",
      fields: [
        {
          id: "name",
          type: "text",
          label: "Name",
          required: true,
        },
        {
          id: "email",
          type: "email",
          label: "Email",
          required: true,
          validation: {
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            message: "Invalid email format",
          },
        },
        {
          id: "age",
          type: "number",
          label: "Age",
          required: true,
          validation: {
            min: 0,
            max: 120,
          },
        },
      ],
    };

    expect(() => isValidSchema(validSchema)).not.toThrow();
  });

  it("should throw an error for missing formTitle or formDescription", () => {
    const invalidSchema = {
      formTitle: "",
      formDescription: "",
      fields: [],
    };
    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw an error if the fields array is missing", () => {
    const invalidSchema: any = {
      formTitle: "Test Form",
      formDescription: "This is a test form",
      // Missing fields array
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw an error if the fields array is empty", () => {
    const invalidSchema: any = {
      formTitle: "Test Form",
      formDescription: "This is a test form",
      fields: [],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw an error if a field is missing a label", () => {
    const invalidSchema: any = {
      formTitle: "Test Form",
      formDescription: "This is a test form",
      fields: [
        {
          id: "name",
          type: "text",
          // Missing label
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw an error if a field is missing a type", () => {
    const invalidSchema: any = {
      formTitle: "Test Form",
      formDescription: "This is a test form",
      fields: [
        {
          id: "name",
          label: "Name",
          // Missing type
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw an error for invalid field type", () => {
    const invalidSchema = {
      formTitle: "Form with Invalid Field",
      formDescription: "Contains invalid field type",
      fields: [
        {
          id: "username",
          type: "invalid-type",
          label: "Username",
          required: true,
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });

  it("should throw an error for missing field id or duplicate ids", () => {
    const invalidSchema = {
      formTitle: "Form with Duplicate Field ID",
      formDescription: "Contains duplicate field ids",
      fields: [
        {
          id: "name",
          type: "text",
          label: "Name",
          required: true,
        },
        {
          id: "name", // Duplicate field ID
          type: "email",
          label: "Email",
          required: true,
        },
      ],
    };

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError);
  });
});


describe("generateZodSchema", () => {
  it("should generate a valid Zod schema", () => {
    const schema: Schema = {
      formTitle: "Valid Form",
      formDescription: "A valid schema form",
      fields: [
        {
          id: "name",
          type: "text",
          label: "Name",
          required: true,
        },
        {
          id: "email",
          type: "email",
          label: "Email",
          required: true,
          validation: {
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            message: "Invalid email format",
          },
        },
        {
          id: "age",
          type: "number",
          label: "Age",
          required: true,
          validation: {
            min: 0,
            max: 120,
          },
        },
      ],
    };

    const zodSchema = generateZodSchema(schema);

    // Validate with valid data
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    };

    expect(() => zodSchema.parse(validData)).not.toThrow();

    // Validate with invalid data
    const invalidData = {
      name: "",
      email: "invalid-email",
      age: 200,
    };

    expect(() => zodSchema.parse(invalidData)).toThrow();
  });

  it("should generate a schema with optional fields", () => {
    const schema: Schema = {
      formTitle: "Form with Optional Fields",
      formDescription: "Has optional fields for validation",
      fields: [
        {
          id: "nickname",
          type: "text",
          label: "Nickname",
          required: false,
        },
      ],
    };

    const zodSchema = generateZodSchema(schema);
    const validData = {}; // Optional field can be omitted
    expect(() => zodSchema.parse(validData)).not.toThrow();
  });

  it("should handle switch field correctly", () => {
    const schema: Schema = {
      formTitle: "Form with Switch Field",
      formDescription: "Includes a switch field for validation",
      fields: [
        {
          id: "newsletter",
          type: "switch",
          label: "Subscribe to newsletter",
          required: true,
        },
      ],
    };

    const zodSchema = generateZodSchema(schema);
    const validData = { newsletter: true }; // valid
    expect(() => zodSchema.parse(validData)).not.toThrow();
    
    const invalidData = { newsletter: false }; // invalid for required
    expect(() => zodSchema.parse(invalidData)).toThrow();
  });

  it("should generate a schema for number fields with validation", () => {
    const schema: Schema = {
      formTitle: "Form with Number Validation",
      formDescription: "Has a field with number validation",
      fields: [
        {
          id: "age",
          type: "number",
          label: "Age",
          required: true,
          validation: {
            min: 18,
            max: 120,
          },
        },
      ],
    };

    const zodSchema = generateZodSchema(schema);

    const validData = { age: 30 };
    expect(() => zodSchema.parse(validData)).not.toThrow();

    const invalidData = { age: 15 };
    expect(() => zodSchema.parse(invalidData)).toThrow();
  });
});
