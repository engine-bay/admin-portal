import { AdminContext, Resource } from "react-admin";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { TableEdit, TableList, TableShow } from "./Tables";

test("Tables index page should render", async () => {
  render(
    <AdminContext>
      <Resource
        name="data-table-blueprints"
        list={TableList}
        edit={TableEdit}
        show={TableShow}
        recordRepresentation={(record) => record.name}
      />
    </AdminContext>
  );
  screen.debug();
  const items = await screen.findAllByText(/data-table-blueprints.empty/);
  expect(items).toHaveLength(1);
});
