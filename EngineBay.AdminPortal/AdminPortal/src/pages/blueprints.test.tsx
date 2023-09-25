import { AdminContext, Resource } from "react-admin";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { BlueprintEdit, BlueprintList, BlueprintShow } from ".";

test("Blueprints index page should render", async () => {
  render(
    <AdminContext>
      <Resource
        name="meta-data/blueprints"
        list={BlueprintList}
        edit={BlueprintEdit}
        show={BlueprintShow}
        recordRepresentation={(record) => record.name}
      />
    </AdminContext>
  );
  screen.debug();
  const items = await screen.findAllByText(/blueprints.empty/);
  expect(items).toHaveLength(1);
});
