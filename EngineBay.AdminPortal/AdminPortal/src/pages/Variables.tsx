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
  WrapperField,
  SelectColumnsButton,
  TopToolbar,
  DatagridConfigurable,
  CreateButton,
  ExportButton,
  FilterButton,
  SimpleListConfigurable,
  SimpleShowLayout,
} from "react-admin";
import { RichTextInput } from "ra-input-rich-text";
import { useTranslate } from "react-admin";

const VariableListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const VariableList = () => {
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
      actions={<VariableListActions />}
      title={translate("variables")}
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
          <TextField label={translate("type")} source="type" />
          <TextField label={translate("default")} source="defaultValue" />
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

export const VariableEdit = () => {
  const translate = useTranslate();
  return (
    <Edit
      resource="data-variable-blueprints"
      title={`${translate("edit")} - ${translate("variable")}`}
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
        <TextInput
          label={translate("type")}
          source="type"
          validate={required()}
          fullWidth
        />
        <RichTextInput
          label={translate("description")}
          source="description"
          fullWidth
        />
        <TextInput
          label={translate("defaultValue")}
          source="defaultValue"
          fullWidth
        />
      </SimpleForm>
    </Edit>
  );
};

export const VariableShow = () => {
  const translate = useTranslate();
  return (
    <Show resource="data-variable-blueprints" title={translate("variables")}>
      <SimpleShowLayout>
        <TextField label={translate("identity")} source="id" />
        <TextField label={translate("name")} source="name" />
        <TextField label={translate("namespace")} source="namespace" />
        <TextField label={translate("type")} source="type" />
        <RichTextField label={translate("description")} source="description" />
        <TextField label={translate("defaultValue")} source="defaultValue" />
        <DateField label={translate("created")} source="createdAt" showTime />
        <DateField
          label={translate("updated")}
          source="lastUpdatedAt"
          showTime
        />
      </SimpleShowLayout>
    </Show>
  );
};
