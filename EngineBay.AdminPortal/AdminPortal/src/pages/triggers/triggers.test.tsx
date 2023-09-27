import { AdminContext, Resource } from "react-admin";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { TriggerEdit, TriggerList, TriggerShow } from "./Triggers";

test("Triggers index page should render", async () => {
  render(
    <AdminContext>
      <Resource
        name="trigger-blueprints"
        list={TriggerList}
        edit={TriggerEdit}
        show={TriggerShow}
        recordRepresentation={(record) => record.name}
      />
    </AdminContext>
  );
  screen.debug();
  const items = await screen.findAllByText(/trigger-blueprints.empty/);
  expect(items).toHaveLength(1);
});
