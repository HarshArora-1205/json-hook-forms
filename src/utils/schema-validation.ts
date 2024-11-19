/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from "zod";
import { Schema, FieldType } from "@/types/schema";

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

	if (typeof schema.formTitle !== "string") {
		errors.push("formTitle must be a string");
	}

	if (typeof schema.formDescription !== "string") {
		errors.push("formDescription must be a string");
	}

	if (!Array.isArray(schema.fields)) {
		errors.push("fields must be an array");
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

function validateFieldTypeSpecificConstraints(field: any, errors: string[]) {
	switch (field.type) {
		case "text":
		case "password":
		case "email":
		case "tel":
		case "textarea":
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
		case "tel":
			if (field.validation) {
				if (
					field.validation.pattern !== undefined &&
					typeof field.validation.pattern !== "string"
				) {
					errors.push(
						`Field "${field.id}" validation pattern must be a string`
					);
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
		case "select":
		case "radio":
		case "checkbox":
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
	return z.object(
		schema.fields.reduce((acc, field) => {
			let fieldSchema: z.ZodType = z.string();

			switch (field.type) {
				case "checkbox":
					fieldSchema = z.array(z.string());
					break;
				case "email":
					if (field.required) {
						fieldSchema = z.string().email("Invalid email address");
						if (field.validation?.pattern) {
							fieldSchema = (fieldSchema as z.ZodString).regex(
								new RegExp(field.validation.pattern),
								field.validation.message || "Invalid format"
							);
						}
					} else {
						fieldSchema = z
							.string()
							.email("Invalid email address")
							.or(z.literal(""))
							.optional();
					}
					break;
				case "number":
					fieldSchema = z.number();
					if (field.validation?.min !== undefined) {
						fieldSchema = (fieldSchema as z.ZodNumber).min(
							field.validation.min,
							`Minimum value is ${field.validation.min}`
						);
					}
					if (field.validation?.max !== undefined) {
						fieldSchema = (fieldSchema as z.ZodNumber).max(
							field.validation.max,
							`Maximum value is ${field.validation.max}`
						);
					}
					break;
				case "range":
					fieldSchema = z
						.number()
						.min(
							field.validation.min,
							`Minimum value is ${field.validation.min}`
						)
						.max(
							field.validation.max,
							`Maximum value is ${field.validation.max}`
						);
					break;
				case "tel":
					fieldSchema = z.string();
					if (field.validation?.pattern) {
						fieldSchema = (fieldSchema as z.ZodString).regex(
							new RegExp(field.validation.pattern),
							field.validation.message || "Invalid phone number"
						);
					} else {
						fieldSchema = (fieldSchema as z.ZodString).regex(
							/^\d{10}$/,
							"Phone number must be 10 digits"
						);
					}
					break;
				case "select":
				case "radio":
					const optionsValues = field.options.map((option) => option.value);

					if (field.required) {
						fieldSchema = z
							.string()
							.refine(
								(val) =>
									val !== undefined &&
									val !== null &&
									val !== "" &&
									optionsValues.includes(val),
								{ message: `${field.label} is required` }
							);
					} else {
						fieldSchema = z
							.string()
							.refine(
								(val) =>
									val === undefined ||
									val === null ||
									val === "" ||
									optionsValues.includes(val),
								{ message: "Invalid selection" }
							)
							.optional()
							.nullable();
					}
					break;
				case "switch":
          if (field.required) {
            fieldSchema = z.boolean().refine(val => val === true, {
              message: 'This field must be true',
            });
          } else {
            fieldSchema = z.boolean();
          }
					break;
				case "password":
					fieldSchema = (z.string() as z.ZodString).min(
						8,
						"Password must be at least 8 characters long"
					);
					break;
				case "textarea":
					fieldSchema = z.string();
					break;
			}

			if (field.type !== "select" && field.type !== "radio" && field.type !== "switch") {
				if (field.required) {
					fieldSchema = fieldSchema.refine(
						(val) => val !== undefined && val !== null && val !== "",
						{
							message: `${field.label} is required`,
						}
					);
				} else {
					fieldSchema = fieldSchema.optional();
				}
			}

			return { ...acc, [field.id]: fieldSchema };
		}, {})
	);
}
