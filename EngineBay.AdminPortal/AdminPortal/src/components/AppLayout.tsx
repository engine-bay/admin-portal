import { Layout, LayoutProps } from "react-admin";
import { lazily } from "react-lazily";
const { NavigationMenu } = lazily(() => import("./NavigationMenu"));
const { CheckForApplicationUpdate } = lazily(() => import("react-admin"));

export const AppLayout = ({ children, ...props }: LayoutProps) => (
  <Layout {...props} menu={NavigationMenu}>
    {children}
    <CheckForApplicationUpdate />
  </Layout>
);
