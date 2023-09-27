import { useMediaQuery, Theme } from "@mui/material";
import {
  List,
  TextField,
  Edit,
  EditButton,
  RichTextField,
  SimpleForm,
  TextInput,
  required,
  DateField,
  Show,
  ShowButton,
  TabbedShowLayout,
  WrapperField,
  SelectColumnsButton,
  TopToolbar,
  DatagridConfigurable,
  CreateButton,
  ExportButton,
  FilterButton,
  SimpleListConfigurable,
} from "react-admin";
import { useTranslate } from "react-admin";
import { DataTableField } from "../../components";
import { lazily } from "react-lazily";
const { RichTextInput } = lazily(() => import("ra-input-rich-text"));

const TableListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const TableList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  const translate = useTranslate();

  const filters = [
    <TextInput
      label={translate("search")}
      source="search"
      alwaysOn
      resettable
    />,
  ];

  return (
    <List
      filters={filters}
      actions={<TableListActions />}
      title={translate("tables")}
    >
      {isSmall ? (
        <SimpleListConfigurable
          primaryText={(record) => record.name}
          secondaryText={(record) => record.description}
        />
      ) : (
        <DatagridConfigurable rowClick="show">
          <TextField label={translate("name")} source="name" />
          <TextField label={translate("namespace")} source="namespace" />
          <RichTextField
            label={translate("description")}
            source="description"
          />
          <DateField label={translate("created")} source="createdAt" showTime />
          <DateField
            label={translate("updated")}
            source="lastUpdatedAt"
            showTime
          />
          <WrapperField label={false}>
            <EditButton />
          </WrapperField>
          <WrapperField label={false}>
            <ShowButton />
          </WrapperField>
        </DatagridConfigurable>
      )}
    </List>
  );
};

export const TableEdit = () => {
  const translate = useTranslate();
  return (
    <Edit
      resource="data-table-blueprints"
      title={`${translate("edit")} - ${translate("table")}`}
    >
      <SimpleForm sanitizeEmptyValues>
        <TextInput
          label={translate("name")}
          source="name"
          validate={required()}
          fullWidth
        />
        <TextInput
          label={translate("namespace")}
          source="namespace"
          validate={required()}
          fullWidth
        />
        <RichTextInput
          label={translate("description")}
          source="description"
          fullWidth
        />
      </SimpleForm>
    </Edit>
  );
};

export const TableShow = () => {
  const translate = useTranslate();
  return (
    <Show resource="data-table-blueprints" title={translate("table")}>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label={translate("summary")}>
          <TextField label={translate("identity")} source="id" />
          <TextField label={translate("name")} source="name" />
          <TextField label={translate("namespace")} source="namespace" />
          <RichTextField
            label={translate("description")}
            source="description"
          />
          <DateField label={translate("created")} source="createdAt" showTime />
          <DateField
            label={translate("updated")}
            source="lastUpdatedAt"
            showTime
          />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label={translate("data")} path="data">
          <DataTableField label={false}></DataTableField>
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  );
};
