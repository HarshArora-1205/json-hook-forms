"use client";

import { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
// import { defaultSchemaString } from "@/lib/defaultSchema";
import { useTheme } from "next-themes";
import * as monaco from "monaco-editor";

interface JSONEditorProps {
	value: string;
	onChange: (value: string) => void;
}

export default function JSONEditor({ value, onChange }: JSONEditorProps) {
	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

	const { theme } = useTheme();

	const handleEditorDidMount: OnMount = (editor, monaco) => {
		editorRef.current = editor;

		monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			schemas: [
				{
					uri: "http://myserver/foo-schema.json",
					fileMatch: ["*"],
					schema: {
						type: "object",
						properties: {
							formTitle: { type: "string" },
							formDescription: { type: "string" },
							fields: {
								type: "array",
								items: {
									type: "object",
									properties: {
										id: { type: "string" },
										type: {
											type: "string",
											enum: [
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
											],
										},
										label: { type: "string" },
										required: { type: "boolean" },
										placeholder: { type: "string" },
										validation: {
											type: "object",
											properties: {
												pattern: { type: "string" },
												message: { type: "string" },
											},
										},
										options: {
											type: "array",
											items: {
												type: "object",
												properties: {
													value: { type: "string" },
													label: { type: "string" },
												},
											},
										},
									},
									required: ["id", "type", "label", "required"],
								},
							},
						},
						required: ["formTitle", "formDescription", "fields"],
					},
				},
			],
		});
	};

	return (
		<Editor
			height="calc(100vh - 250px)"
			defaultLanguage="json"
			value={value}
			theme={theme === "light" ? "hc-light" : "vs-dark"}
			onChange={(newValue) => onChange(newValue || "")}
			onMount={handleEditorDidMount}
			options={{
				minimap: { enabled: false },
				lineNumbers: "on",
				roundedSelection: false,
				scrollBeyondLastLine: false,
				readOnly: false,
				autoIndent: "advanced",
				cursorBlinking: "phase",
			}}
		/>
	);
}
