/* eslint-disable @typescript-eslint/no-explicit-any */
import Editor from "@monaco-editor/react";
import { useTheme } from "react-admin";
import { useController } from "react-hook-form";

export const ExpressionInput = () => {
  const [theme] = useTheme();
  const expressionController = useController({
    name: "expression",
    defaultValue: "",
  });

  const { value, onChange } = expressionController.field;

  const handleEditorValidation = (markers: any) => {
    // model markers
    markers.forEach((marker: any) =>
      console.log("onValidate:", marker.message)
    );
  };

  return (
    <Editor
      height="50vh"
      language="typescript"
      value={value}
      onChange={onChange}
      theme={theme === "light" ? "light" : "vs-dark"}
      onValidate={handleEditorValidation}
    />
  );
};
