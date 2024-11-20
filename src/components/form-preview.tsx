import { Schema, Field } from "@/types/schema";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateZodSchema } from "@/utils/schema-validation";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import DynamicField from "@/components/dynamic-field";
import { z } from "zod";

interface FormPreviewProps {
	schema: Schema;
}

export default function FormPreview({ schema }: FormPreviewProps) {
	const zodSchema = generateZodSchema(schema);
	const form = useForm({
		resolver: zodResolver(zodSchema),
		defaultValues: schema.fields.reduce(
			(acc, field) => ({
				...acc,
				[field.id]: getDefaultValue(field),
			}),
			{}
		),
	});

	const onSubmit = async (data: z.infer<typeof zodSchema>) => {
		try {
			// Show loading state during submission
			await new Promise((resolve) => setTimeout(resolve, 1000));

			toast({
				title: "Form Submitted Successfully",
				description: (
					<pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
						<code className="text-white">{JSON.stringify(data, null, 2)}</code>
					</pre>
				),
			});
		} catch (error) {
			console.error(error)
			toast({
				title: "Error",
				description: "Something went wrong while submitting the form.",
				variant: "destructive",
			});
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<h2 className="text-xl font-bold">{schema.formTitle}</h2>
				<p className="text-sm text-gray-500">{schema.formDescription}</p>
				{schema.fields.map((field) => (
					<DynamicField key={field.id} field={field} form={form} />
				))}
				<Button type="submit" disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting ? "Submitting..." : "Submit"}
				</Button>
			</form>
		</Form>
	);
}

function getDefaultValue(field: Field) {
	switch (field.type) {
		case "checkbox-group":
			return [];
		case "checkbox":
		case "switch":
			return false;
		case "number":
		case "range":
			return field.validation?.min || 0;
		default:
			return "";
	}
}
