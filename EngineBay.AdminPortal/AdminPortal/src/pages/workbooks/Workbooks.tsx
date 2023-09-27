import { useMediaQuery, Theme, Alert } from "@mui/material";
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
  ArrayField,
  Count,
  useRecordContext,
  TabbedShowLayout,
  WrapperField,
  SelectColumnsButton,
  TopToolbar,
  DatagridConfigurable,
  CreateButton,
  ExportButton,
  FilterButton,
  SimpleListConfigurable,
  Create,
  FileField,
  FileInput,
  useCreate,
  useRedirect,
} from "react-admin";
import { useTranslate } from "react-admin";
import { Blueprint, Workbook, importBlueprints } from "../../lib";
import { lazily } from "react-lazily";
const { RichTextInput } = lazily(() => import("ra-input-rich-text"));

const BlueprintsCount = () => {
  const record = useRecordContext();
  if (!record) return null;
  return <Count resource={`meta-data/workbooks/${record.id}/blueprints`} />;
};

// const ComplexityScoreCount = () => {
//   const record = useRecordContext();
//   if (!record) return null;
//   return (
//     <ReferenceOneField
//       label="Complexity"
//       resource={`workbooks/${record.id}/complexity-score`}
//       target="id"
//     >
//       <TextField source="score" />
//     </ReferenceOneField>
//   );
// };

const WorkbookListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const WorkbookList = () => {
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
      actions={<WorkbookListActions />}
      title={translate("workbooks")}
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
          {/* <ComplexityScoreCount /> */}
          <WrapperField label={translate("blueprints")}>
            <BlueprintsCount />
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

export const WorkbookEdit = () => {
  const translate = useTranslate();
  return (
    <Edit
      resource="workbooks"
      redirect={() => "meta-data/workbooks"}
      title={`${translate("edit")} - ${translate("workbook")}`}
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

export const WorkbookShow = () => {
  const translate = useTranslate();
  return (
    <Show resource="workbooks" title={translate("workbook")}>
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
        <TabbedShowLayout.Tab label={translate("blueprints")} path="blueprints">
          <ArrayField label={false} source="blueprints">
            <Datagrid bulkActionButtons={false} optimized>
              <TextField label={translate("name")} source="name" />
              <RichTextField
                label={translate("description")}
                source="description"
              />
              <ShowButton resource="blueprints" />
            </Datagrid>
          </ArrayField>
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  );
};

type Attachment = {
  rawFile: Blob;
};

type WorkbookImportFormData = {
  name?: string;
  description?: string;
  attachments?: Attachment[];
};

export const WorkbookImport = () => {
  const translate = useTranslate();
  const [create] = useCreate();
  const redirect = useRedirect();
  const saveWorkbook = async (data: WorkbookImportFormData) => {
    const { name, description, attachments } = data;

    let blueprints: Blueprint[] = [];

    if (attachments) {
      for (const attachment of attachments) {
        const attachmentBlueprints = await importBlueprints(attachment.rawFile);
        blueprints = [...blueprints, ...attachmentBlueprints];
      }
    }

    const workbook: Workbook = {
      name,
      description,
      blueprints,
    };

    create("workbooks", { data: workbook });
    redirect("/meta-data/workbooks");
  };
  return (
    <Create title={translate("create")}>
      <SimpleForm onSubmit={saveWorkbook}>
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
        <WrapperField>
          <Alert severity="info" style={{ marginBottom: 16 }}>
            {translate("alerts.info.workbookFileImport")}
          </Alert>
        </WrapperField>
        <FileInput
          label={translate("attachments")}
          source="attachments"
          multiple
          options={{
            accept: [".xlsx", ".xls"],
          }}
        >
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};
