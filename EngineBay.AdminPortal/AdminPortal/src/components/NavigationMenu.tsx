import { Menu } from "react-admin";
import WorkIcon from "@mui/icons-material/Work";
import LayersIcon from "@mui/icons-material/Layers";
import FunctionsIcon from "@mui/icons-material/Functions";
import DataObjectIcon from "@mui/icons-material/DataObject";
import DataSetIcon from "@mui/icons-material/Dataset";
import FlagIcon from "@mui/icons-material/Flag";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useTranslate } from "react-admin";

export const NavigationMenu = () => {
  const translate = useTranslate();
  return (
    <Menu>
      <Menu.DashboardItem primaryText={translate("dashboard")} />
      <Menu.Item
        to="/workbooks"
        primaryText={translate("studio.title")}
        leftIcon={<AppRegistrationIcon />}
      />
      <Menu.Item
        to="/meta-data/workbooks"
        primaryText={translate("workbooks")}
        leftIcon={<WorkIcon />}
      />
      <Menu.Item
        to="/meta-data/blueprints"
        primaryText={translate("blueprints")}
        leftIcon={<LayersIcon />}
      />
      <Menu.Item
        to="/meta-data/expression-blueprints"
        primaryText={translate("expressions")}
        leftIcon={<FunctionsIcon />}
      />
      <Menu.Item
        to="/data-variable-blueprints"
        primaryText={translate("variables")}
        leftIcon={<DataObjectIcon />}
      />
      <Menu.Item
        to="/data-table-blueprints"
        primaryText={translate("tables")}
        leftIcon={<DataSetIcon />}
      />
      <Menu.Item
        to="/trigger-blueprints"
        primaryText={translate("triggers")}
        leftIcon={<FlagIcon />}
      />
    </Menu>
  );
};
