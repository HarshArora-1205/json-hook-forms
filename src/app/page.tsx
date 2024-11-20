"use client";

import { useState, useEffect } from "react";

import {
	isValidSchema,
	SchemaValidationError,
} from "@/utils/schema-validation";
import { AlertCircle, CheckCircle2, Copy, FileIcon } from "lucide-react";
import { Schema } from "@/types/schema";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import FormPreview from "@/components/form-preview";
import CodePreview from "@/components/code-preview";
import JSONEditor from "@/components/json-editor";
import { DocsPopover } from "@/components/docs-popover";

export default function Home() {
	const [jsonSchema, setJsonSchema] = useState('');
	const [parsedSchema, setParsedSchema] = useState<Schema | null>(null);
	const [jsonError, setJsonError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [code, setCode] = useState<string>("");
	const [codeType, setCodeType] = useState<string>("shadcn");
	const [activeTab, setActiveTab] = useState("preview");

	useEffect(() => {
		try {
			const parsed: Schema = JSON.parse(jsonSchema);
			isValidSchema(parsed);
			setParsedSchema(parsed);
			setJsonError(null);
		} catch (error) {
			console.error(error);
			setParsedSchema(null);
			if (error instanceof SyntaxError) {
				setJsonError(`Invalid JSON: ${error.message}`);
			} else if (error instanceof SchemaValidationError) {
				setJsonError(`Schema validation error: ${error.errors.join(", ")}`);
			} else {
				setJsonError("An unknown error occurred");
			}
		}
	}, [jsonSchema]);

	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleCodeChange = (code: string) => {
		setCode(code);
	};

	return (
		<div className="container mx-auto p-4">
			<div className="sticky bg-background top-0 z-50 p-4 mb-2 flex justify-between">
				<h1 className="text-2xl font-semibold tracking-wider">
					JSON HOOK FORMS
				</h1>
				<div className="flex gap-4">
					<DocsPopover />
					<ModeToggle />
				</div>
			</div>
			<div className="grid lg:grid-cols-2 gap-4">
				<Card className="h-fit lg:sticky lg:top-16">
					<CardContent className="p-4">
						<JSONEditor value={jsonSchema} onChange={setJsonSchema} />
						{jsonError && (
							<Alert variant="destructive" className="mt-4">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{jsonError}</AlertDescription>
							</Alert>
						)}
						{!jsonError && (
							<Alert variant="default" className="mt-4">
								<CheckCircle2 className="h-4 w-4" />
								<AlertTitle>Success</AlertTitle>
								<AlertDescription>JSON is valid</AlertDescription>
							</Alert>
						)}
					</CardContent>
				</Card>
				<Card className="h-fit">
					<CardContent className="p-4">
						<Tabs defaultValue="preview" onValueChange={setActiveTab}>
							<div className="flex flex-col gap-4 lg:flex-row justify-between items-center mb-4 ">
								<TabsList>
									<TabsTrigger value="preview">Form Preview</TabsTrigger>
									<TabsTrigger value="code">Generated Code</TabsTrigger>
								</TabsList>
								<div className="flex gap-4">
									{activeTab === "code" && (
										<Select value={codeType} onValueChange={setCodeType}>
											<SelectTrigger>
												<SelectValue placeholder="Code Type" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectItem value="shadcn">
														Shadcn UI Components
													</SelectItem>
													<SelectItem value="html">HTML Tags</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									)}
									<Button
										variant="outline"
										size="icon"
										onClick={handleCopy}
										className="relative group"
									>
										{copied ? (
											<CheckCircle2 className="h-4 w-4" />
										) : (
											<>
												<Copy className="h-4 w-4 transition-all group-hover:scale-0" />
												<FileIcon className="absolute h-4 w-4 transition-all scale-0 group-hover:scale-100" />
											</>
										)}
									</Button>
								</div>
							</div>
							<TabsContent value="preview">
								{parsedSchema ? (
									<FormPreview schema={parsedSchema} />
								) : (
									<Alert>
										<AlertCircle className="h-4 w-4" />
										<AlertTitle>No Preview</AlertTitle>
										<AlertDescription>
											Enter a valid JSON schema to see the form preview.
										</AlertDescription>
									</Alert>
								)}
							</TabsContent>
							<TabsContent value="code">
								<CodePreview
									schema={parsedSchema}
									codeType={codeType as "html" | "shadcn"}
									setCode={handleCodeChange}
								/>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>
			<Toaster />
		</div>
	);
}
