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
  ArrayField,
  Datagrid,
} from "react-admin";
import { useTranslate } from "react-admin";
import { lazily } from "react-lazily";
const { RichTextInput } = lazily(() => import("ra-input-rich-text"));

const TriggerListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const TriggerList = () => {
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
      actions={<TriggerListActions />}
      title={translate("triggers")}
    >
      {isSmall ? (
        <SimpleListConfigurable
          primaryText={(record) => record.name}
          secondaryText={(record) => record.description}
        />
      ) : (
        <DatagridConfigurable rowClick="show">
          <TextField label={translate("name")} source="name" />
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

export const TriggerEdit = () => {
  const translate = useTranslate();
  return (
    <Edit
      resource="trigger-blueprints"
      title={`${translate("edit")} - ${translate("trigger")}`}
    >
      <SimpleForm sanitizeEmptyValues>
        <TextInput
          label={translate("name")}
          source="name"
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

export const TriggerShow = () => {
  const translate = useTranslate();
  return (
    <Show resource="trigger-blueprints" title={translate("trigger")}>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label={translate("summary")}>
          <TextField label={translate("identity")} source="id" />
          <TextField label={translate("name")} source="name" />
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
        <TabbedShowLayout.Tab
          label={translate("expressions")}
          path="expressions"
        >
          <ArrayField label={false} source="triggerExpressionBlueprints">
            <Datagrid bulkActionButtons={false} optimized>
              <RichTextField
                label={translate("objective")}
                source="objective"
              />
              <TextField label={translate("expression")} source="expression" />
              <TextField label={translate("inputVariable")} source="inputDataVariableBlueprint.name" />
              <TextField label={translate("namespace")} source="inputDataVariableBlueprint.namespace" />
              <TextField label={translate("type")} source="inputDataVariableBlueprint.type" />
            </Datagrid>
          </ArrayField>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab
          label={translate("outputDataVariables")}
          path="outputDataVariableBlueprint"
        >
          <TextField
            label={translate("name")}
            source="outputDataVariableBlueprint.name"
          />
          <TextField
            label={translate("namespace")}
            source="outputDataVariableBlueprint.namespace"
          />
          <TextField
            label={translate("type")}
            source="outputDataVariableBlueprint.type"
          />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  );
};
