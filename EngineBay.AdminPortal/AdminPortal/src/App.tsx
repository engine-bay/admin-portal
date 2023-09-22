import { Admin, Resource, ShowGuesser, ListGuesser } from "react-admin";
import { AppLayout } from "./components/AppLayout";
import { dataProvider, authProvider } from "./lib";
import { WorkbookList, BlueprintList } from "./pages";

const App = () => (
  <Admin
    title="EngineBay Admin Portal"
    authProvider={authProvider}
    dataProvider={dataProvider}
    layout={AppLayout}
    disableTelemetry
  >
    <Resource name="workbooks" list={WorkbookList} />
    <Resource name="blueprints" list={BlueprintList} show={ShowGuesser} />
  </Admin>
);

export default App;
