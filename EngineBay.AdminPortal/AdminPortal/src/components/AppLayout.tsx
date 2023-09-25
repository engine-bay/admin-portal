import { CheckForApplicationUpdate, Layout, LayoutProps } from "react-admin";
import { NavigationMenu } from "./NavigationMenu";

export const AppLayout = ({ children, ...props }: LayoutProps) => (
  <Layout {...props} menu={NavigationMenu}>
    {children}
    <CheckForApplicationUpdate />
  </Layout>
);
