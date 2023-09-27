import { Admin, useTranslate, Resource } from "react-admin";
import { dataProvider, authProvider, i18nProvider } from "./lib";
import { lazily } from "react-lazily";
import { QueryClient } from "react-query";
import { lightTheme, darkTheme } from "./themes";

const { AppLayout } = lazily(() => import("./components/AppLayout"));

const { WorkbookList, WorkbookEdit, WorkbookShow, WorkbookImport } = lazily(
  () => import("./pages")
);
const { BlueprintList, BlueprintEdit, BlueprintShow } = lazily(
  () => import("./pages")
);
const { ExpressionList, ExpressionEdit, ExpressionShow } = lazily(
  () => import("./pages")
);

const { VariableList, VariableEdit, VariableShow } = lazily(
  () => import("./pages")
);

const { TableList, TableEdit, TableShow } = lazily(() => import("./pages"));

const { TriggerList, TriggerEdit, TriggerShow } = lazily(
  () => import("./pages")
);

const { StudioList, StudioShow } = lazily(() => import("./pages"));

const App = () => {
  // this sets up a basic client-side cache
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0.5 * 60 * 1000, // 30 seconds
      },
    },
  });

  const translate = useTranslate();

  return (
    <Admin
      title={translate("appTitle")}
      theme={lightTheme}
      darkTheme={darkTheme}
      i18nProvider={i18nProvider}
      authProvider={authProvider}
      dataProvider={dataProvider}
      queryClient={queryClient}
      layout={AppLayout}
      disableTelemetry
    >
      <Resource
        name="workbooks"
        list={StudioList}
        show={StudioShow}
        recordRepresentation={(record) => record.name}
      />
      <Resource
        name="meta-data/workbooks"
        options={{ label: translate("workbooks") }}
        list={WorkbookList}
        edit={WorkbookEdit}
        show={WorkbookShow}
        create={WorkbookImport}
        recordRepresentation={(record) => record.name}
      />
      <Resource
        name="blueprints"
        show={BlueprintShow}
        recordRepresentation={(record) => record.name}
      />
      <Resource
        name="meta-data/blueprints"
        options={{ label: translate("blueprints") }}
        list={BlueprintList}
        edit={BlueprintEdit}
        show={BlueprintShow}
        recordRepresentation={(record) => record.name}
      />
      <Resource
        name="expression-blueprints"
        show={ExpressionShow}
        recordRepresentation={(record) => record.name}
      />
      <Resource
        name="meta-data/expression-blueprints"
        options={{ label: translate("expressions") }}
        list={ExpressionList}
        edit={ExpressionEdit}
        show={ExpressionShow}
        recordRepresentation={(record) => record.objective}
      />
      <Resource
        name="data-variable-blueprints"
        options={{ label: translate("variables") }}
        list={VariableList}
        edit={VariableEdit}
        show={VariableShow}
        recordRepresentation={(record) => record.name}
      />
      <Resource
        name="data-table-blueprints"
        options={{ label: translate("tables") }}
        list={TableList}
        edit={TableEdit}
        show={TableShow}
        recordRepresentation={(record) => record.name}
      />
      <Resource
        name="trigger-blueprints"
        options={{ label: translate("triggers") }}
        list={TriggerList}
        edit={TriggerEdit}
        show={TriggerShow}
        recordRepresentation={(record) => record.name}
      />
    </Admin>
  );
};

export default App;
