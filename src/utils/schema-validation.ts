/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from "zod";
import { Schema, FieldType, Field } from "@/types/schema";

export class SchemaValidationError extends Error {
	constructor(public errors: string[]) {
		super("Schema validation failed");
		this.name = "SchemaValidationError";
	}
}

export function isValidSchema(schema: any): schema is Schema {
	const errors: string[] = [];

	if (typeof schema !== "object" || schema === null) {
		errors.push("Schema must be an object");
		throw new SchemaValidationError(errors);
	}

	if (typeof schema.formTitle !== "string" || schema.formTitle === "") {
		errors.push("formTitle is required as a string");
	}

	if (typeof schema.formDescription !== "string" || schema.formDescription === "") {
		errors.push("formDescription is required as a string");
	}

	if (!Array.isArray(schema.fields)) {
		errors.push("fields must be an array");
		throw new SchemaValidationError(errors);
	}

	if(schema.fields.length === 0){
		errors.push("fields can not be empty");
		throw new SchemaValidationError(errors);
	}

	const ids = new Set<string>();

	schema.fields.forEach((field: any, index: number) => {
		if (typeof field !== "object" || field === null) {
			errors.push(`Field at index ${index} must be an object`);
			return;
		}

		if (typeof field.id !== "string") {
			errors.push(`Field at index ${index} must have a string id`);
		} else if (ids.has(field.id)) {
			errors.push(`Duplicate field ID found: "${field.id}"`);
		} else {
			ids.add(field.id);
		}

		if (!isValidFieldType(field.type)) {
			errors.push(`Invalid field type "${field.type}" for field "${field.id}"`);
		}

		if (typeof field.label !== "string") {
			errors.push(`Field "${field.id}" must have a string label`);
		}

		if (field.required !== undefined && typeof field.required !== "boolean") {
			errors.push(`Field "${field.id}" required property must be a boolean`);
		}

		validateFieldTypeSpecificConstraints(field, errors);
	});

	if (errors.length > 0) {
		throw new SchemaValidationError(errors);
	}

	return true;
}

function isValidFieldType(type: any): type is FieldType {
	return [
		"checkbox",
		"checkbox-group",
		"email",
		"number",
		"range",
		"tel",
		"select",
		"radio",
		"text",
		"textarea",
		"switch",
		"password",
	].includes(type);
}

function isValidRegex(pattern: string): boolean {
  try {
    new RegExp(pattern);
    return true;
  } catch (e) {
		console.error(e)
    return false;
  }
}

function validateFieldTypeSpecificConstraints(field: any, errors: string[]) {
	switch (field.type) {
		case "textarea":
		case "text":
			if (field.validation) {
				if (
					typeof field.validation.min === "number" && 
					typeof field.validation.max === "number" &&
					field.validation.min > field.validation.max
				) {
					errors.push(
						`Field "${field.id}": max should be greater than min`
					);
				}
			}
		case "password":
		case "email":
		case "tel":
		case "select":
			if (
				field.placeholder !== undefined &&
				typeof field.placeholder !== "string"
			) {
				errors.push(`Field "${field.id}" placeholder must be a string`);
			}
			break;
	}

	switch (field.type) {
		case "email":
		case "password":
		case "tel":
			if (field.validation) {
				if (
					field.validation.pattern !== undefined &&
					typeof field.validation.pattern !== "string"
				) {
					errors.push(
						`Field "${field.id}" validation pattern must be a string`
					);
				} else if (typeof field.validation.pattern === "string") {
					const pattern = field.validation.pattern;
					if (!isValidRegex(pattern)) {
							errors.push(
									`Field "${field.id}" validation pattern must be a valid regex expression.`
							);
					}
				}
				if (
					field.validation.message !== undefined &&
					typeof field.validation.message !== "string"
				) {
					errors.push(
						`Field "${field.id}" validation message must be a string`
					);
				}
			}
			break;
		case "number":
		case "range":
			if (field.validation) {
				if (
					field.validation.min !== undefined &&
					typeof field.validation.min !== "number"
				) {
					errors.push(`Field "${field.id}" min value must be a number`);
				}
				if (
					field.validation.max !== undefined &&
					typeof field.validation.max !== "number"
				) {
					errors.push(`Field "${field.id}" max value must be a number`);
				}
				if (
					typeof field.validation.min === "number" && 
					typeof field.validation.max === "number" &&
					field.validation.min > field.validation.max
				) {
					errors.push(
						`Field "${field.id}": max should be greater than min`
					);
				}
				if (
					field.validation.step !== undefined &&
					typeof field.validation.step !== "number"
				) {
					errors.push(`Field "${field.id}" step value must be a number`);
				}
				if (
					field.validation.message !== undefined &&
					typeof field.validation.message !== "string"
				) {
					errors.push(
						`Field "${field.id}" validation message must be a string`
					);
				}
			}
			if (field.type === "range") {
				if (
					!field.validation ||
					field.validation.min === undefined ||
					field.validation.max === undefined
				) {
					errors.push(
						`Field "${field.id}" of type range must have min and max values`
					);
				}
			}
			break;
		case "checkbox":
			break;
		case "checkbox-group":
		case "select":
		case "radio":
			if (!Array.isArray(field.options) || field.options.length === 0) {
				errors.push(`Field "${field.id}" must have non-empty options array`);
			} else {
				field.options.forEach((option: any, index: number) => {
					if (
						typeof option !== "object" ||
						typeof option.value !== "string" ||
						typeof option.label !== "string"
					) {
						errors.push(
							`Invalid option at index ${index} for field "${field.id}"`
						);
					}
				});
			}
			break;
	}
}

export function generateZodSchema(schema: Schema) {
  const codeLines: string[] = [];
  
  const zodSchema = z.object(
    schema.fields.reduce<Record<string, z.ZodTypeAny>>((acc, field) => {
      let fieldCode = "";

      switch (field.type) {
        case 'text':
        case 'textarea':
          let textSchema = z.string();
          fieldCode = `z.string()`;

          if (field.validation?.min !== undefined) {
            textSchema = textSchema.min(
              field.validation.min,
              field.validation.message || `${field.label} must be at least ${field.validation.min} characters long`
            );
            fieldCode += `.min(${field.validation.min}, "${field.validation.message || `${field.label} must be at least ${field.validation.min} characters long`}")`;
          }

          if (field.validation?.max !== undefined) {
            textSchema = textSchema.max(
              field.validation.max,
              field.validation.message || `${field.label} must be no longer than ${field.validation.max} characters`
            );
            fieldCode += `.max(${field.validation.max}, "${field.validation.message || `${field.label} must be no longer than ${field.validation.max} characters`}")`;
          }

          acc[field.id] = field.required
            ? textSchema.min(1, `${field.label} is required`)
            : textSchema.optional();

          fieldCode = field.required
            ? `${fieldCode}.min(1, "${field.label} is required")`
            : `${fieldCode}.optional()`;

          break;

        case 'email':
          let emailSchema = z.string().email('Invalid email address');
          fieldCode = `z.string().email("Invalid email address")`;

          if (field.validation?.pattern) {
            emailSchema = emailSchema.regex(
              new RegExp(field.validation.pattern),
              field.validation.message || 'Invalid email format'
            );
            fieldCode += `.regex(/${field.validation.pattern}/, "${field.validation.message || 'Invalid email format'}")`;
          }

          acc[field.id] = field.required
            ? emailSchema
            : z.union([emailSchema, z.literal('')]);

          fieldCode = field.required
            ? fieldCode
            : `z.union([${fieldCode}, z.literal("")])`;

          break;

        case 'password':
          let passwordSchema = z.string();
          fieldCode = `z.string()`;

          if (field.validation?.pattern) {
            passwordSchema = passwordSchema.regex(
              new RegExp(field.validation.pattern),
              field.validation.message || 'Invalid password format'
            );
            fieldCode += `.regex(/${field.validation.pattern}/, "${field.validation.message || 'Invalid password format'}")`;
          } else {
            passwordSchema = passwordSchema.min(8, 'Password must be at least 8 characters long');
            fieldCode += `.min(8, "Password must be at least 8 characters long")`;
          }

          acc[field.id] = field.required
            ? passwordSchema
            : z.union([passwordSchema, z.literal('')]);

          fieldCode = field.required
            ? fieldCode
            : `z.union([${fieldCode}, z.literal("")])`;

          break;

        case 'number':
          let numberSchema = z.number();
          fieldCode = `z.number()`;

          if (field.validation?.min !== undefined) {
            numberSchema = numberSchema.min(
              field.validation.min,
              field.validation.message || `Minimum value is ${field.validation.min}`
            );
            fieldCode += `.min(${field.validation.min}, "${field.validation.message || `Minimum value is ${field.validation.min}`}")`;
          }

          if (field.validation?.max !== undefined) {
            numberSchema = numberSchema.max(
              field.validation.max,
              field.validation.message || `Maximum value is ${field.validation.max}`
            );
            fieldCode += `.max(${field.validation.max}, "${field.validation.message || `Maximum value is ${field.validation.max}`}")`;
          }

          if (field.validation?.step !== undefined) {
            numberSchema = numberSchema.multipleOf(
              field.validation.step,
              field.validation.message || `Value must be a multiple of ${field.validation.step}`
            );
            fieldCode += `.multipleOf(${field.validation.step}, "${field.validation.message || `Value must be a multiple of ${field.validation.step}`}")`;
          }

          acc[field.id] = field.required
            ? z.preprocess((val) => (typeof val === "string" ? Number(val) : val), numberSchema)
            : z.preprocess((val) => (typeof val === "string" ? Number(val) : val), numberSchema.optional());

          fieldCode = field.required
            ? `z.preprocess((val) => (typeof val === "string" ? Number(val) : val), ${fieldCode})`
            : `z.preprocess((val) => (typeof val === "string" ? Number(val) : val), ${fieldCode}.optional())`;

          break;

        case 'checkbox':
          const checkboxSchema = field.required
            ? z.boolean().refine((val) => val === true, { message: `${field.label} must be checked` })
            : z.boolean();
          acc[field.id] = checkboxSchema;

          fieldCode = field.required
            ? `z.boolean().refine((val) => val === true, { message: "${field.label} must be checked" })`
            : `z.boolean()`;

          break;

        case 'radio':
        case 'select':
          const optionsValues = field.options?.map(option => option.value) || [];
          const selectSchema = z.enum(optionsValues as [string, ...string[]]);
          acc[field.id] = field.required ? selectSchema : z.union([selectSchema, z.literal("")]);

          fieldCode = field.required
            ? `z.enum([${optionsValues.map(val => `"${val}"`).join(", ")}])`
            : `z.union([z.enum([${optionsValues.map(val => `"${val}"`).join(", ")}]), z.literal("")])`;

          break;

        case 'checkbox-group':
          const checkboxOptionsValues = field.options?.map(option => option.value) || [];
          const checkboxGroupSchema = z.array(z.enum(checkboxOptionsValues as [string, ...string[]]));
          acc[field.id] = field.required
            ? checkboxGroupSchema.min(1, `Please select at least one option for ${field.label}`)
            : z.union([checkboxGroupSchema, z.array(z.string()).length(0)]);

          fieldCode = field.required
            ? `z.array(z.enum([${checkboxOptionsValues.map(val => `"${val}"`).join(", ")}])).min(1, "Please select at least one option for ${field.label}")`
            : `z.union([z.array(z.enum([${checkboxOptionsValues.map(val => `"${val}"`).join(", ")}])), z.array(z.string()).length(0)])`;

          break;

        case 'tel':
          const telSchema = field.validation?.pattern
            ? z.string().regex(
                new RegExp(field.validation.pattern),
                field.validation.message || 'Invalid phone number format'
              )
            : z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits');
          acc[field.id] = field.required ? telSchema : z.union([telSchema, z.literal("")]);

          fieldCode = field.validation?.pattern
            ? `z.string().regex(/${field.validation.pattern}/, "${field.validation.message || 'Invalid phone number format'}")`
            : `z.string().regex(/^\d{10}$/, "Phone number must be 10 digits")`;

          fieldCode = field.required
            ? fieldCode
            : `z.union([${fieldCode}, z.literal("")])`;

          break;

				case 'range': {
					let rangeSchema = z.number()
						.min(
							field.validation?.min || 0,
							field.validation?.message || `Minimum value is ${field.validation?.min || 0}`
						)
						.max(
							field.validation?.max || 100,
							field.validation?.message || `Maximum value is ${field.validation?.max || 100}`
						);

					if (field.validation?.step !== undefined) {
						rangeSchema = rangeSchema.multipleOf(field.validation.step);
					}

					acc[field.id] = field.required
						? rangeSchema
						: rangeSchema.optional();

					fieldCode = field.required
						? `z.number().min(${field.validation?.min || 0}).max(${field.validation?.max || 100})`
						: `z.number().min(${field.validation?.min || 0}).max(${field.validation?.max || 100}).optional()`;

					break;
				}

				case 'switch': {
					acc[field.id] = field.required
						? z.boolean().refine(val => val === true, { message: `${field.label} must be turned on` })
						: z.boolean();

					fieldCode = field.required
						? `z.boolean().refine(val => val === true, { message: "${field.label} must be turned on" })`
						: `z.boolean()`;

					break;
				}


        default:
          throw new Error(`Unsupported field type: ${(field as Field).type}`);
      }

      codeLines.push(`"${field.id}": ${fieldCode}`);
      return acc;
    }, {})
  );

  const zodSchemaCode = `z.object({\n  ${codeLines.join(',\n  ')}\n});`;

  return { zodSchema, zodSchemaCode };
}