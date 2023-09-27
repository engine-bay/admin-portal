import { AdminContext, Resource } from "react-admin";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { WorkbookEdit, WorkbookImport, WorkbookList, WorkbookShow } from "./Workbooks";

test("Workbooks index page should render", async () => {
  render(
    <AdminContext>
      <Resource
        name="meta-data/workbooks"
        list={WorkbookList}
        edit={WorkbookEdit}
        show={WorkbookShow}
        create={WorkbookImport}
        recordRepresentation={(record) => record.name}
      />
    </AdminContext>
  );
  screen.debug();
  const items = await screen.findAllByText(/workbooks.empty/);
  expect(items).toHaveLength(1);
});
