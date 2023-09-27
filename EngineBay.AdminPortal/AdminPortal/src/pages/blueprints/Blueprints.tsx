import { useMediaQuery, Theme } from "@mui/material";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  TextInput,
  Edit,
  SimpleForm,
  required,
  RichTextField,
  DateField,
  Show,
  ShowButton,
  Count,
  useRecordContext,
  ArrayField,
  TabbedShowLayout,
  WrapperField,
  CreateButton,
  ExportButton,
  FilterButton,
  SelectColumnsButton,
  TopToolbar,
  DatagridConfigurable,
  SimpleListConfigurable,
} from "react-admin";
import { useTranslate } from "react-admin";
import { lazily } from "react-lazily";
const { RichTextInput } = lazily(() => import("ra-input-rich-text"));

const ExpressionBlueprintsCount = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Count
      resource={`meta-data/workbooks/${record.workbookId}/blueprints/${record.id}/expression-blueprints`}
    />
  );
};

const DataVariableBlueprintsCount = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Count
      resource={`workbooks/${record.workbookId}/blueprints/${record.id}/data-variable-blueprints`}
    />
  );
};

const DataTableBlueprintsCount = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Count
      resource={`workbooks/${record.workbookId}/blueprints/${record.id}/data-table-blueprints`}
    />
  );
};

const TriggerBlueprintsCount = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Count
      resource={`workbooks/${record.workbookId}/blueprints/${record.id}/trigger-blueprints`}
    />
  );
};

const BlueprintListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const BlueprintList = () => {
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
      actions={<BlueprintListActions />}
      title={translate("blueprints")}
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
          <WrapperField label={translate("expressions")}>
            <ExpressionBlueprintsCount />
          </WrapperField>
          <WrapperField label={translate("variables")}>
            <DataVariableBlueprintsCount />
          </WrapperField>
          <WrapperField label={translate("tables")}>
            <DataTableBlueprintsCount />
          </WrapperField>
          <WrapperField label={translate("triggers")}>
            <TriggerBlueprintsCount />
          </WrapperField>
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

export const BlueprintEdit = () => {
  const translate = useTranslate();
  return (
    <Edit
      resource="blueprints"
      redirect={() => "meta-data/blueprints"}
      title={`${translate("edit")} - ${translate("blueprint")}`}
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

export const BlueprintShow = () => {
  const translate = useTranslate();
  return (
    <Show resource="blueprints" title={translate("blueprint")}>
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
          label={translate("dataVariables")}
          path="dataVariableBlueprints"
        >
          <ArrayField label={false} source="dataVariableBlueprints">
            <Datagrid bulkActionButtons={false} optimized>
              <TextField label={translate("name")} source="name" />
              <TextField label={translate("namespace")} source="namespace" />
              <RichTextField
                label={translate("description")}
                source="description"
              />
              <ShowButton resource="data-variable-blueprints" />
            </Datagrid>
          </ArrayField>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab
          label={translate("expressions")}
          path="expressionBlueprints"
        >
          <ArrayField label={false} source="expressionBlueprints">
            <Datagrid bulkActionButtons={false} optimized>
              <RichTextField
                label={translate("objective")}
                source="objective"
              />
              <TextField label={translate("expression")} source="expression" />
              <ShowButton resource="expression-blueprints" />
            </Datagrid>
          </ArrayField>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab
          label={translate("dataTables")}
          path="dataTableBlueprints"
        >
          <ArrayField label={false} source="dataTableBlueprints">
            <Datagrid bulkActionButtons={false} optimized>
              <TextField label={translate("name")} source="name" />
              <TextField label={translate("namespace")} source="namespace" />
              <RichTextField
                label={translate("description")}
                source="description"
              />
              <ShowButton resource="data-table-blueprints" />
            </Datagrid>
          </ArrayField>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab
          label={translate("triggers")}
          path="triggerBlueprints"
        >
          <ArrayField label={false} source="triggerBlueprints">
            <Datagrid bulkActionButtons={false} optimized>
              <TextField label={translate("name")} source="name" />
              <RichTextField
                label={translate("description")}
                source="description"
              />
              <ShowButton resource="trigger-blueprints" />
            </Datagrid>
          </ArrayField>
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  );
};
