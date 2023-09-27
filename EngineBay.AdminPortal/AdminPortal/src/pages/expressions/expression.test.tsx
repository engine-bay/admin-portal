import { AdminContext, Resource } from "react-admin";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ExpressionEdit, ExpressionList, ExpressionShow } from "./Expressions";

test("Expressions index page should render", async () => {
  render(
    <AdminContext>
      <Resource
        name="meta-data/Expressions"
        list={ExpressionList}
        edit={ExpressionEdit}
        show={ExpressionShow}
        recordRepresentation={(record) => record.name}
      />
    </AdminContext>
  );
  screen.debug();
  const items = await screen.findAllByText(/Expressions.empty/);
  expect(items).toHaveLength(1);
});
