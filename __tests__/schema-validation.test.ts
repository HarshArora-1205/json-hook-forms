import { isValidSchema, generateZodSchema, SchemaValidationError } from '@/utils/schema-validation'
import { Schema } from '@/types/schema'
import { z } from 'zod'

describe('isValidSchema', () => {
  it('should validate a correct schema', () => {
    const validSchema: Schema = {
      formTitle: 'Test Form',
      formDescription: 'This is a test form',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          required: true,
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          required: true,
          validation: {
            pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
            message: 'Please enter a valid email address',
          },
        },
        {
          id: 'age',
          type: 'number',
          label: 'Age',
          required: true,
          validation: {
            min: 0,
            max: 120,
          },
        },
        {
          id: 'phone',
          type: 'tel',
          label: 'Phone',
          required: true,
          validation: {
            pattern: '^\\d{10}$',
          },
        },
        {
          id: 'password',
          type: 'password',
          label: 'Password',
          required: true,
        },
        {
          id: 'comments',
          type: 'textarea',
          label: 'Comments',
          required: false,
        },
        {
          id: 'size',
          type: 'select',
          label: 'T-Shirt Size',
          required: true,
          options: [
            { value: 's', label: 'Small' },
            { value: 'm', label: 'Medium' },
            { value: 'l', label: 'Large' },
          ],
        },
        {
          id: 'color',
          type: 'radio',
          label: 'Favorite Color',
          required: true,
          options: [
            { value: 'red', label: 'Red' },
            { value: 'blue', label: 'Blue' },
            { value: 'green', label: 'Green' },
          ],
        },
        {
          id: 'interests',
          type: 'checkbox',
          label: 'Interests',
          required: false,
        },
        {
          id: 'rating',
          type: 'range',
          label: 'Rating',
          required: true,
          validation: {
            min: 1,
            max: 5,
            step: 1,
          },
        },
        {
          id: 'newsletter',
          type: 'switch',
          label: 'Subscribe to newsletter',
          required: false,
        },
      ],
    }

    expect(() => isValidSchema(validSchema)).not.toThrow()
  })

  it('should throw an error for an invalid schema', () => {
    const invalidSchema = {
      formTitle: 'Invalid Form',
      fields: 'Not an array',
    }

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError)
  })

  it('should validate field-specific constraints', () => {
    const invalidSchema: any = {
      formTitle: 'Test Form',
      formDescription: 'This is a test form',
      fields: [
        {
          id: 'age',
          type: 'number',
          label: 'Age',
          required: true,
          validation: {
            min: 'not a number',
          },
        },
        {
          id: 'phone',
          type: 'tel',
          label: 'Phone',
          required: true,
          validation: {
            pattern: '^\\d{9}$', // Invalid pattern for phone
          },
        },
        {
          id: 'size',
          type: 'select',
          label: 'T-Shirt Size',
          required: true,
          options: 'Not an array', // Invalid options
        },
      ],
    }

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError)
  })

  it('should throw an error for duplicate field IDs', () => {
    const invalidSchema: any = {
      formTitle: 'Test Form',
      formDescription: 'This is a test form',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          required: true,
        },
        {
          id: 'name', // Duplicate ID
          type: 'email',
          label: 'Email',
          required: true,
        },
      ],
    }

    expect(() => isValidSchema(invalidSchema)).toThrow(SchemaValidationError)
  })
})

describe('generateZodSchema', () => {
  it('should generate a valid Zod schema', () => {
    const schema: Schema = {
      formTitle: 'Test Form',
      formDescription: 'This is a test form',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          required: true,
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          required: true,
          validation: {
            pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
            message: 'Please enter a valid email address',
          },
        },
        {
          id: 'age',
          type: 'number',
          label: 'Age',
          required: true,
          validation: {
            min: 0,
            max: 120,
          },
        },
        {
          id: 'interests',
          type: 'checkbox',
          label: 'Interests',
          required: false,
        },
      ],
    }

    const zodSchema = generateZodSchema(schema)

    expect(zodSchema).toBeInstanceOf(z.ZodObject)

    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      interests: true,
    }

    expect(() => zodSchema.parse(validData)).not.toThrow()

    const invalidData = {
      name: '',
      email: 'not-an-email',
      age: 150,
      interests: 'not-an-array',
    }

    expect(() => zodSchema.parse(invalidData)).toThrow()
  })

  it('should generate a schema with optional fields', () => {
    const schema: Schema = {
      formTitle: 'Test Form',
      formDescription: 'This is a test form',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          required: false,
        },
      ],
    }

    const zodSchema = generateZodSchema(schema)
    const validData = {}

    expect(() => zodSchema.parse(validData)).not.toThrow()
  })

  it('should generate a schema with switch field', () => {
    const schema: Schema = {
      formTitle: 'Test Form',
      formDescription: 'This is a test form',
      fields: [
        {
          id: 'newsletter',
          type: 'switch',
          label: 'Subscribe to newsletter',
          required: true,
        },
      ],
    }

    const zodSchema = generateZodSchema(schema)
    const validData = { newsletter: true }
    const invalidData = { newsletter: false }

    expect(() => zodSchema.parse(validData)).not.toThrow()
    expect(() => zodSchema.parse(invalidData)).toThrow()
  })
})