import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Schema, Field } from "@/types/schema";
import { useEffect } from "react";
import { generateZodSchema } from "@/utils/schema-validation";

interface CodePreviewProps {
	schema: Schema | null;
	codeType: "html" | "shadcn";
	setCode: (code: string) => void;
}

export default function CodePreview({
	schema,
	codeType,
	setCode,
}: CodePreviewProps) {
	const generatedCode = schema
		? codeType === "html"
			? generateHTMLCode(schema)
			: generateShadcnCode(schema)
		: "// Enter a valid JSON schema to generate the code";

	useEffect(() => {
		setCode(generatedCode);
	}, [generatedCode, setCode]);

	return (
    <SyntaxHighlighter
      language="typescript"
      style={tomorrow}
      wrapLines={true}
      lineProps={{
        style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' }
      }}
      customStyle={{
        margin: 0,
        padding: "1rem",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        maxHeight: "calc(100vh - 250px)",
        overflow: "auto",
      }}
    >
      {generatedCode}
    </SyntaxHighlighter>
	);
}

function generateHTMLCode(schema: Schema): string {
	const {zodSchemaCode} = generateZodSchema(schema);

	const renderField = (field: Field): string => {
		switch (field.type) {
			case "text":
			case "email":
			case "password":
			case "tel":
				return `<input type="${field.type}" id="${
					field.id
				}" {...form.register("${field.id}")} ${
					"placeholder" in field && field.placeholder
						? `placeholder="${field.placeholder}"`
						: ""
				} />`;

			case "number":
				return `<input type="number" id="${field.id}" {...form.register("${
					field.id
				}")} ${
					"placeholder" in field && field.placeholder
						? `placeholder="${field.placeholder}"`
						: ""
				} ${
					"validation" in field && field.validation?.min !== undefined
						? `min="${field.validation.min}"`
						: ""
				} ${
					"validation" in field && field.validation?.max !== undefined
						? `max="${field.validation.max}"`
						: ""
				} ${
					"validation" in field && field.validation?.step !== undefined
						? `step="${field.validation.step}"`
						: ""
				} />`;

			case "range":
				return `<input type="range" id="${field.id}" {...form.register("${
					field.id
				}")} ${
					field.validation.min !== undefined
						? `min="${field.validation.min}"`
						: ""
				} ${
					field.validation.max !== undefined
						? `max="${field.validation.max}"`
						: ""
				} ${
					field.validation.step !== undefined
						? `step="${field.validation.step}"`
						: ""
				} />`;

			case "select":
				return `<select {...form.register("${field.id}")}>
          ${field.options
						?.map(
							(option) =>
								`<option value="${option.value}">${option.label}</option>`
						)
						.join("\n          ")}
        </select>`;

			case "radio":
				return `${field.options
					?.map(
						(option) => `
        <label>
          <input type="radio" {...form.register("${field.id}")} value="${option.value}" />
          ${option.label}
        </label>`
					)
					.join("\n        ")}`;

      case "checkbox":
        return `
          <label>
            <input type="checkbox" {...form.register("${field.id}")} />
            ${field.label}
          </label>
        `;
      case "checkbox-group":
        return `${field.options
          ?.map(
            (option) => `
        <label>
          <input type="checkbox" {...form.register("${field.id}")} value="${option.value}" />
          ${option.label}
        </label>`
          )
          .join("\n        ")}`;
			case "textarea":
				return `<textarea {...form.register("${field.id}")} ${
					"placeholder" in field && field.placeholder
						? `placeholder="${field.placeholder}"`
						: ""
				} />`;

			case "switch":
				return `<input type="checkbox" {...form.register("${field.id}")} />`;

			default:
				return `<!-- Unsupported field type -->`;
		}
	};

	return `/* HTML Form with React Hook Form and Zod Validation */
/* Make sure to install required dependencies */

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = ${JSON.stringify(schema, null, 2)};

const zodSchema = ${zodSchemaCode};

type FormData = z.infer<typeof zodSchema>;

export function DynamicForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(zodSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <h2>${schema.formTitle}</h2>
      <p>${schema.formDescription}</p>
      ${schema.fields
				.map(
					(field) => `
      <div>
        <label htmlFor="${field.id}">${field.label}${
						field.required ? " *" : ""
					}</label>
        ${renderField(field)}
        {form.formState.errors.${field.id} && <span>{form.formState.errors.${
						field.id
					}?.message}</span>}
      </div>`
				)
				.join("\n      ")}
      <button type="submit">Submit</button>
    </form>
  );
}`;
}

function generateShadcnCode(schema: Schema): string {
	const { zodSchemaCode } = generateZodSchema(schema);

	const renderField = (field: Field): string => {
		switch (field.type) {
			case "text":
			case "email":
			case "password":
			case "tel":
				return `<FormField
          control={form.control}
          name="${field.id}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}${field.required ? " *" : ""}</FormLabel>
              <FormControl>
                <Input 
                  autocomplete="off"
                  type="${field.type}" 
                  placeholder="${
										"placeholder" in field && field.placeholder
											? field.placeholder
											: ""
									}"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;

			case "number":
				return `<FormField
          control={form.control}
          name="${field.id}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}${field.required ? " *" : ""}</FormLabel>
              <FormControl>
                <Input 
                  autocomplete="off"
                  type="number" 
                  placeholder="${
										"placeholder" in field && field.placeholder
											? field.placeholder
											: ""
									}"
                  ${
										"validation" in field && field.validation?.min !== undefined
											? `min={${field.validation.min}}`
											: ""
									}
                  ${
										"validation" in field && field.validation?.max !== undefined
											? `max={${field.validation.max}}`
											: ""
									}
                  ${
										"validation" in field &&
										field.validation?.step !== undefined
											? `step={${field.validation.step}}`
											: ""
									}
                  {...field} 
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;

			case "range":
				return `<FormField
          control={form.control}
          name="${field.id}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}${field.required ? " *" : ""}</FormLabel>
              <FormControl>
                <div className="flex gap-8">
                  <Slider
                    id={field.id}
                    min={field.validation?.min || 0}
                    max={field.validation?.max || 100}
                    step={field.validation?.step || 1}
                    value={[formField.value]}
                    onValueChange={(value) => formField.onChange(value[0])}
                  />
                  <span className="text-sm font-bold">{formField.value}</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;

			case "select":
				return `<FormField
          control={form.control}
          name="${field.id}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}${field.required ? " *" : ""}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  ${field.options
										?.map(
											(option) =>
												`<SelectItem value="${option.value}">${option.label}</SelectItem>`
										)
										.join("\n                  ")}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />`;

			case "radio":
				return `<FormField
          control={form.control}
          name="${field.id}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}${field.required ? " *" : ""}</FormLabel>
              <FormControl>
                <RadioGroup 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  ${field.options
										?.map(
											(option) => `
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="${option.value}" id="${field.id}-${option.value}" />
                      <Label htmlFor="${field.id}-${option.value}">${option.label}</Label>
                    </div>`
										)
										.join("\n                  ")}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;

			case "checkbox":
				return `<FormField
          control={form.control}
          name={field.id}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {field.label}
                {field.required ? " *" : ""}
              </FormLabel>
              <FormControl>
                <Checkbox
                  className="block"
                  checked={formField.value}
                  onCheckedChange={(checked) => {
                    formField.onChange(checked);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;
      case "checkbox-group":
        return `<FormField
          control={form.control}
          name="${field.id}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}${field.required ? " *" : ""}</FormLabel>
              <div className="flex space-x-2">
                ${field.options
                  ?.map(
                    (option) => `
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value?.includes(option.value)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...(field.value || []), option.value]
                          : (field.value || []).filter(v => v !== option.value);
                        field.onChange(newValue);
                      }}
                      id="${field.id}-${option.value}"
                    />
                    <Label htmlFor="${field.id}-${option.value}">${option.label}</Label>
                  </div>
                </FormControl>`
                  )
                  .join("\n                ")}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />`;
			case "textarea":
				return `<FormField
          control={form.control}
          name="${field.id}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}${field.required ? " *" : ""}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="${
										"placeholder" in field && field.placeholder
											? field.placeholder
											: ""
									}"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;

			case "switch":
				return `<FormField
          control={form.control}
          name="${field.id}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}${field.required ? " *" : ""}</FormLabel>
              <FormControl>
                <Switch
                  className="block"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;

			default:
				return `{/* Unsupported field type */}`;
		}
	};

	return `/* Shadcn Form with React Hook Form and Zod Validation */
/* Make sure to install required dependencies */

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const formSchema = ${zodSchemaCode}

export function DynamicForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ${schema.fields
				.map(
					(field) =>
						`${field.id}: ${
							field.type === "checkbox"
								? "[]"
								: field.type === "switch"
								? "false"
								: '""'
						},`
				)
				.join("\n      ")}
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2>${schema.formTitle}</h2>
        <p>${schema.formDescription}</p>
        ${schema.fields.map(renderField).join("\n        ")}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}`;
}
