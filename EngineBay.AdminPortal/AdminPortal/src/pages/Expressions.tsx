import { useMediaQuery, Theme } from "@mui/material";
import {
  List,
  Datagrid,
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
  Count,
  useRecordContext,
  WrapperField,
  ArrayField,
  CreateButton,
  DatagridConfigurable,
  ExportButton,
  FilterButton,
  SelectColumnsButton,
  SimpleListConfigurable,
  TopToolbar,
} from "react-admin";
import { RichTextInput } from "ra-input-rich-text";
import { useTranslate } from "react-admin";

const InputDataVariableBlueprintsCount = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Count
      resource={`workbooks/${record.workbookId}/blueprints/${record.blueprintId}/expression-blueprints/${record.id}/input-data-variable-blueprints`}
    />
  );
};

const OutputDataVariableBlueprintsCount = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Count
      resource={`workbooks/${record.workbookId}/blueprints/${record.blueprintId}/expression-blueprints/${record.id}/output-data-variable-blueprints`}
    />
  );
};

const InputDataTableBlueprintsCount = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Count
      resource={`workbooks/${record.workbookId}/blueprints/${record.blueprintId}/data-table-blueprints`}
    />
  );
};

const ExpressionListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const ExpressionList = () => {
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
    <List filters={filters} actions={<ExpressionListActions />} title={translate("expressions")}>
      {isSmall ? (
        <SimpleListConfigurable
          primaryText={(record) => record.name}
          secondaryText={(record) => record.description}
        />
      ) : (
        <DatagridConfigurable rowClick="show">
          <RichTextField label={translate("objective")} source="objective" />
          <WrapperField label={translate("inputVariables")}>
            <InputDataVariableBlueprintsCount />
          </WrapperField>
          <WrapperField label={translate("inputTables")}>
            <InputDataTableBlueprintsCount />
          </WrapperField>
          <WrapperField label={translate("outputVariables")}>
            <OutputDataVariableBlueprintsCount />
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

export const ExpressionEdit = () => {
  const translate = useTranslate();
  return (
    <Edit
      resource="expression-blueprints"
      redirect={() => "meta-data/expression-blueprints"}
      title={`${translate("edit")} - ${translate("expression")}`}
    >
      <SimpleForm sanitizeEmptyValues>
        <RichTextInput
          label={translate("objective")}
          source="objective"
          fullWidth
        />
        <TextInput
          label={translate("expression")}
          multiline
          source="expression"
          validate={required()}
          fullWidth
        />
      </SimpleForm>
    </Edit>
  );
};

export const ExpressionShow = () => {
  const translate = useTranslate();
  return (
    <Show resource="expression-blueprints" title={translate("expression")}>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label={translate("summary")}>
          <TextField label={translate("identity")} source="id" />
          <RichTextField label={translate("objective")} source="objective" />
          <TextField label={translate("expression")} source="expression" />
          <DateField label={translate("created")} source="createdAt" showTime />
          <DateField
            label={translate("updated")}
            source="lastUpdatedAt"
            showTime
          />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab
          label={translate("inputDataVariables")}
          path="inputDataVariableBlueprints"
        >
          <ArrayField label={false} source="inputDataVariableBlueprints">
            <Datagrid bulkActionButtons={false} optimized>
              <TextField label={translate("name")} source="name" />
              <TextField label={translate("namespace")} source="namespace" />
              <TextField label={translate("type")} source="type" />
              <ShowButton resource="data-variable-blueprints" />
            </Datagrid>
          </ArrayField>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab
          label={translate("inputDataTables")}
          path="inputDataTableBlueprints"
        >
          <ArrayField label={false} source="inputDataTableBlueprints">
            <Datagrid bulkActionButtons={false} optimized>
              <TextField label={translate("name")} source="name" />
              <TextField label={translate("namespace")} source="namespace" />
              <ShowButton resource="data-table-blueprints" />
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
