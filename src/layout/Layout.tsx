import * as React from "react";
import { Layout } from "react-admin";
import Menu from "./Menu";

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <Layout
    menu={Menu}
    sx={{
      backgroundColor: (theme) =>
        // @ts-expect-error TS mixes up the Theme type from all the different versions of MUI in the monorepo
        (theme.vars || theme).palette.background.default,
    }}
  >
    {children}
  </Layout>
);

export default AppLayout;
