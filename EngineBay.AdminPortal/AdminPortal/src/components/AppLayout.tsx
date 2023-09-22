import { CheckForApplicationUpdate, Layout, LayoutProps } from "react-admin";

export const AppLayout = ({ children, ...props }: LayoutProps) => (
  <Layout {...props}>
    {children}
    <CheckForApplicationUpdate />
  </Layout>
);
