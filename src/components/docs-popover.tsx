import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DocsPopover() {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline">Docs</Button>
			</PopoverTrigger>
			<PopoverContent className="w-screen max-w-[600px] sm:w-full p-0">
				<div className="relative">
					<PopoverClose className="absolute top-2 right-2 z-10">
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<X className="h-4 w-4" />
						</Button>
					</PopoverClose>
					<ScrollArea className="h-[600px] p-4 overflow-y-auto">
						<div id="all-types" className="bg-background z-0 py-2">
							<h4 className="mb-4 text-sm font-medium leading-none">
								JSON Hook Forms Docs
							</h4>
							<p className="text-sm text-muted-foreground mb-4 break-words">
								This application allows you to generate dynamic forms using a
								JSON schema.
							</p>
						</div>
						<Tabs defaultValue="general">
							<TabsList>
								<TabsTrigger value="general">General</TabsTrigger>
								<TabsTrigger value="fields">Field Types</TabsTrigger>
							</TabsList>
							<TabsContent value="general">
								<h5 className="text-sm font-medium mb-2">
									General Schema Structure:
								</h5>
								<pre className="text-xs bg-muted p-2 rounded mb-4 break-words whitespace-pre-wrap">
									{`{
  "formTitle": "string (optional)",
  "formDescription": "string (optional)",
  "fields": [
    // Array of field objects (required)
  ]
}`}
								</pre>
								<h5 className="text-sm font-medium mb-2">
									Common Field Properties:
								</h5>
								<ul className="text-sm list-disc list-inside mb-4">
									<li>id (required): string</li>
									<li>type (required): one of the available field types</li>
									<li>label (required): string</li>
									<li>required (optional): boolean, default false</li>
									<li>placeholder (optional): string</li>
								</ul>
							</TabsContent>
							<TabsContent value="fields">
								<h5 className="text-sm font-medium mb-2">
									You can use 12 types of fields as of now
								</h5>
								<ul className="text-sm list-disc list-inside mb-4">
									{fieldTypes.map((field) => (
									<li key={field.type}>
										<a
											href={`#${field.type}`}
											className="cursor-pointer text-blue-500 underline"
										>
										{field.type}
										</a>
									</li>
									))}
								</ul>
								{fieldTypes.map((field) => (
									<div key={field.type} id={field.type}  className="mb-4">
										<h5 className="text-md font-medium mb-2">type: {field.type}
											<a href="#all-types" className="ml-6 text-blue-500 underline">back to top</a>
										</h5>
										<p className="text-sm mb-2 break-words">
											{field.description}
										</p>
										<h6 className="text-sm font-medium mb-1">Properties:</h6>
										<ul className="text-sm list-disc list-inside mb-2">
											{field.properties.map((prop) => (
												<li key={prop} className="break-words">
													{prop}
												</li>
											))}
										</ul>
										<h6 className="text-sm font-medium mb-1">Example:</h6>
										<pre className="text-xs bg-muted p-2 rounded break-words whitespace-pre-wrap">
											{field.example}
										</pre>
									</div>
								))}
							</TabsContent>
						</Tabs>
					</ScrollArea>
				</div>
			</PopoverContent>
		</Popover>
	);
}

const fieldTypes = [
	{
		type: "text",
		description: "A single-line text input field.",
		properties: [
			"id: string (required)",
			"type: string (required)",
			"label: string (required)",
			"placeholder: string (optional)",
			"required: boolean (optional)",
			"validation: { min: number, max: number, message: string } (optional)",
		],
		example: `{
  "id": "name",
  "type": "text",
  "label": "Full Name",
  "required": true,
  "placeholder": "Enter your full name",
  "validation": {
    "min": 10,
    "max": 120,
    "message": "Length should be greater than equal to 10 and less than 120"
  }
}`,
	},
	{
		type: "email",
		description: "An email input field with built-in email validation.",
		properties: [
			"id: string (required)",
			"type: string (required)",
			"label: string (required)",
			"placeholder: string (optional)",
			"required: boolean (optional)",
			"validation: { pattern: string, message: string } (optional)",
		],
		example: `{
  "id": "email",
  "type": "email",
  "label": "Email Address",
  "required": true,
  "placeholder": "you@example.com",
  "validation": {
    "pattern": "^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$",
    "message": "Please enter a valid email address"
  }
}`,
	},
	{
		type: "password",
		description: "A password input field with optional regex validation.",
		properties: [
			"id: string (required)",
			"type: string (required)",
			"label: string (required)",
			"placeholder: string (optional)",
			"required: boolean (optional)",
			"validation: { pattern: string, message: string } (optional)",
		],
		example: `{
  "id": "password",
  "type": "password",
  "label": "Password",
  "required": true,
  "placeholder": "Enter your password",
  "validation": {
    "pattern": "^(?=.*[A-Za-z])(?=.*\\\\d)[A-Za-z\\\\d]{8,}$",
    "message": "Password must be at least 8 characters long and contain at least one letter and one number"
  }
}`,
	},
	{
		type: "number",
		description:
			"A numeric input field with optional min, max, and step constraints.",
		properties: [
			"id: string (required)",
			"type: string (required)",
			"label: string (required)",
			"placeholder: string (optional)",
			"required: boolean (optional)",
			"validation: { min: number, max: number, step: number, message: string } (optional)",
		],
		example: `{
  "id": "age",
  "type": "number",
  "label": "Age",
  "required": true,
  "placeholder": "Enter your age",
  "validation": {
    "min": 0,
    "max": 120,
    "step": 1
  }
}`,
	},
	{
		type: "tel",
		description:
			"A telephone number input field with a required 10-digit pattern.",
		properties: [
			"id: string (required)",
			"type: string (required)",
			"label: string (required)",
			"placeholder: string (optional)",
			"required: boolean (optional)",
			"validation: { pattern: string, message: string } (optional)",
		],
		example: `{
  "id": "phone",
  "type": "tel",
  "label": "Phone Number",
  "required": true,
  "placeholder": "Enter your phone number"
}`,
	},
	{
		type: "textarea",
		description: "A multi-line text input field.",
		properties: [
			"id: string (required)",
			"type: string (required)",
			"label: string (required)",
			"placeholder: string (optional)",
			"required: boolean (optional)",
			"validation: { min: number, max: number, message: string } (optional)",
		],
		example: `{
  "id": "comments",
  "type": "textarea",
  "label": "Additional Comments",
  "required": false,
  "placeholder": "Any other details you'd like to share..."
}`,
	},
	{
		type: "select",
		description: "A dropdown select field with predefined options.",
		properties: [
			"id: string (required)",
			"type: string (required)",
			"label: string (required)",
			"options: Array<{ value: string, label: string }> (required)",
			"placeholder: string (optional)",
			"required: boolean (optional)",
		],
		example: `{
  "id": "companySize",
  "type": "select",
  "label": "Company Size",
  "required": true,
  "options": [
    { "value": "1-50", "label": "1-50 employees" },
    { "value": "51-200", "label": "51-200 employees" },
    { "value": "201-1000", "label": "201-1000 employees" },
    { "value": "1000+", "label": "1000+ employees" }
  ]
}`,
	},
	{
		type: "radio",
		description: "A group of radio buttons for selecting a single option.",
		properties: [
			"id: string (required)",
			"type: string (required)",
			"label: string (required)",
			"options: Array<{ value: string, label: string }> (required)",
			"required: boolean (optional)",
		],
		example: `{
  "id": "industry",
  "type": "radio",
  "label": "Industry",
  "required": true,
  "options": [
    { "value": "tech", "label": "Technology" },
    { "value": "healthcare", "label": "Healthcare" },
    { "value": "finance", "label": "Finance" },
    { "value": "retail", "label": "Retail" },
    { "value": "other", "label": "Other" }
  ]
}`,
	},
	{
		type: "checkbox",
		description: "A single checkbox for say agree terms & conditions",
		properties: [
			"id: string (required)",
			"type: string (required)",
			"label: string (required)",
			"required: boolean (optional)",
		],
		example: `{
  "id": "agree",
  "type": "checkbox",
  "label": "Do you agree?",
  "required": true,
}`,
	},
	{
		type: "checkbox-group",
		description: "A group of checkboxes for selecting multiple options.",
		properties: [
			"id: string (required)",
			"type: string (required)",
			"label: string (required)",
			"options: Array<{ value: string, label: string }> (required)",
			"required: boolean (optional)",
		],
		example: `{
  "id": "interests",
  "type": "checkbox-group",
  "label": "Interests",
  "required": false,
  "options": [
    { "value": "sports", "label": "Sports" },
    { "value": "music", "label": "Music" },
    { "value": "reading", "label": "Reading" }
  ]
}`,
	},
	{
		type: "range",
		description: "A slider input for selecting a numeric value within a range.",
		properties: [
			"id: string (required)",
			"type: string (required)",
			"label: string (required)",
			"required: boolean (optional)",
			"validation: { min: number, max: number, step: number, message: string } (partially required)",
		],
		example: `{
  "id": "rating",
  "type": "range",
  "label": "Rating",
  "required": true,
  "validation": {
    "min": 1,
    "max": 5,
    "step": 1
  }
}`,
	},
	{
		type: "switch",
		description: "A toggle switch for boolean input.",
		properties: [
			"id: string (required)",
			"type: string (required)",
			"label: string (required)",
			"required: boolean (optional)",
		],
		example: `{
  "id": "newsletter",
  "type": "switch",
  "label": "Subscribe to newsletter",
  "required": false
}`,
	},
];
