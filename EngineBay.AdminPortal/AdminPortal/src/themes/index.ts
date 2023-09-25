import { defaultTheme } from "react-admin";

export const lightTheme = defaultTheme;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const darkTheme = { ...defaultTheme, palette: { mode: "dark" as any } };