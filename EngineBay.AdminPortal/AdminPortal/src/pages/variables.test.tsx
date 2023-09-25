import { AdminContext, Resource } from "react-admin";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { VariableEdit, VariableList, VariableShow } from ".";

test("Variables index page should render", async () => {
  render(
    <AdminContext>
      <Resource
        name="data-variable-blueprints"
        list={VariableList}
        edit={VariableEdit}
        show={VariableShow}
        recordRepresentation={(record) => record.name}
      />
    </AdminContext>
  );
  screen.debug();
  const items = await screen.findAllByText(/data-variable-blueprints.empty/);
  expect(items).toHaveLength(1);
});
