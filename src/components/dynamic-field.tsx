import React from "react";
import { Field } from "@/types/schema";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

interface DynamicFieldProps {
	field: Field;
	form: UseFormReturn<FieldValues>;
}

export default function DynamicField({ field, form }: DynamicFieldProps) {
	return (
		<FormField
			control={form.control}
			name={field.id}
			render={({ field: formField }) => (
				<FormItem>
					<FormLabel>
						{field.label}{" "}
						{field.required && <span className="text-red-500"> *</span>}
					</FormLabel>
					<FormControl>{renderField(field, formField)}</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

function renderField(field: Field, formField: FieldValues) {
	switch (field.type) {
		case "text":
		case "email":
		case "password":
		case "tel":
			return (
				<Input
				  autoComplete="off"
					type={field.type}
					placeholder={field.placeholder}
					{...formField}
				/>
			);
		case "number":
			return (
				<Input
				  autoComplete="off"
					type={field.type}
					min={field.validation?.min}
					max={field.validation?.max}
					placeholder={field.placeholder}
					{...formField}
				/>
			);
		case "textarea":
			return <Textarea placeholder={field.placeholder} {...formField} />;
		case "select":
			return (
				<Select
					onValueChange={formField.onChange}
					defaultValue={formField.value}
				>
					<SelectTrigger>
						<SelectValue
							placeholder={field.placeholder || "Select an option"}
						/>
					</SelectTrigger>
					<SelectContent>
						{field.options?.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			);
		case "radio":
			return (
				<RadioGroup
					onValueChange={formField.onChange}
					defaultValue={formField.value}
				>
					{field.options?.map((option) => (
						<div key={option.value} className="flex items-center space-x-2">
							<RadioGroupItem
								value={option.value}
								id={`${field.id}-${option.value}`}
							/>
							<Label htmlFor={`${field.id}-${option.value}`}>
								{option.label}
							</Label>
						</div>
					))}
				</RadioGroup>
			);
		case "checkbox":
			return (
        <Checkbox
					className="block"
          checked={formField.value}
          onCheckedChange={(checked) => {
            formField.onChange(checked);
          }}
        />
			);
		case "checkbox-group":
			return (
				<div className="flex flex-col space-y-2">
					{field.options?.map((option) => (
						<div key={option.value} className="flex items-center space-x-2">
							<Checkbox
								id={`${field.id}-${option.value}`}
								checked={formField.value?.includes(option.value)}
								onCheckedChange={(checked) => {
									const updatedValue = checked
										? [...(formField.value || []), option.value]
										: formField.value?.filter(
												(v: string) => v !== option.value
											);
									formField.onChange(updatedValue);
								}}
							/>
							<Label htmlFor={`${field.id}-${option.value}`}>
								{option.label}
							</Label>
						</div>
					))}
				</div>
			);
		case "switch":
			return (
				<Switch
					className="block"
					checked={formField.value}
					onCheckedChange={formField.onChange}
				/>
			);
		case "range":
			return (
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
			);
		default:
			return null;
	}
}
