import { useTranslate } from "ra-core";
import {
  Show,
  EditButton,
  Button,
  List,
  TextInput,
  SimpleList,
  TopToolbar,
} from "react-admin";
import { useLocalStorage } from "usehooks-ts";
import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import { formatRelative } from "date-fns";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useState } from "react";
import { SelectedElement } from "./SelectedElement";
import SaveIcon from "@mui/icons-material/Save";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import { LayoutSkeleton } from "./LayoutSkeleton";
import { Blueprint } from "../../lib";
import { lazily } from "react-lazily";

const { WorkbookTree } = lazily(() => import("./WorkbookTree"));
const { BlueprintVisualizer } = lazily(() => import("./BlueprintVisualizer"));

const ResponsiveGridLayout = WidthProvider(GridLayout);

const defaultLayout: Layout[] = [
  {
    i: "workbook-tree",
    x: 0,
    y: 0,
    w: 3,
    h: 6,
    minW: 3,
    minH: 3,
    static: false,
  },
  { i: "visualizer", x: 3, y: 0, w: 6, h: 6, minW: 3, minH: 3, static: false },
  // { i: "c", x: 9, y: 0, w: 3, h: 6, minW: 3, minH: 3, static: false },
];

export const StudioList = () => {
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
      resource="meta-data/workbooks"
      filters={filters}
      title={translate("studio.title")}
      actions={false}
    >
      <SimpleList
        primaryText={(record) => record.name}
        secondaryText={(record) =>
          `Last edited ${formatRelative(
            new Date(record.lastUpdatedAt),
            new Date()
          )}`
        }
        resource="workbooks"
        linkType={"show"}
      />
    </List>
  );
};

export const StudioShow = () => {
  const translate = useTranslate();

  const [layout, setLayout] = useLocalStorage<Layout[]>(
    "studio.layout",
    defaultLayout
  );

  const [editingLayout, setEditingLayout] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint>();
  const [selectedElement, setSelectedElement] = useState<SelectedElement>();

  const toggleEditingLayoutMode = () => {
    setEditingLayout(!editingLayout);
  };

  const handleLayoutChange = (updatedLayout: Layout[]) => {
    setLayout(updatedLayout);
  };

  const resetLayout = () => {
    setLayout(defaultLayout);
  };

  const StudioShowActions = () => {
    return (
      <TopToolbar>
        {!editingLayout && <EditButton />}
        {!editingLayout && (
          <Button
            startIcon={<ViewComfyIcon />}
            color="primary"
            onClick={toggleEditingLayoutMode}
            label={translate("studio.customizeLayout")}
          />
        )}
        {editingLayout && (
          <Button
            startIcon={<SaveIcon />}
            color="primary"
            onClick={resetLayout}
            label={translate("studio.resetLayout")}
          />
        )}
        {editingLayout && (
          <Button
            startIcon={<SaveIcon />}
            color="primary"
            onClick={toggleEditingLayoutMode}
            label={translate("studio.saveLayout")}
          />
        )}
      </TopToolbar>
    );
  };

  return (
    <Show title={translate("workbook")} actions={<StudioShowActions />}>
      <ResponsiveGridLayout
        className="layout"
        layout={layout}
        cols={12}
        maxRows={12}
        isDraggable={editingLayout}
        isResizable={editingLayout}
        resizeHandles={["n", "e", "s", "w", "sw", "nw", "se", "ne"]}
        rowHeight={80}
        onResize={handleLayoutChange}
        onDrag={handleLayoutChange}
        autoSize
      >
        <div key="workbook-tree">
          <LayoutSkeleton isEditingLayout={editingLayout} label={"Blueprints"}>
            <WorkbookTree
              // selectedElement={selectedElement}
              onBlueprintSelected={(bluePrint) =>
                setSelectedBlueprint(bluePrint)
              }
              onElementSelected={(updatedElement) =>
                setSelectedElement(updatedElement)
              }
            />
          </LayoutSkeleton>
        </div>
        <div key="visualizer">
          <LayoutSkeleton isEditingLayout={editingLayout} label={"Visualizer"}>
            {selectedBlueprint ? (
              <BlueprintVisualizer
                selectedElement={selectedElement}
                blueprint={selectedBlueprint}
                onElementSelected={(updatedElement: SelectedElement) =>
                  setSelectedElement(updatedElement)
                }
              />
            ) : (
              <div />
            )}
          </LayoutSkeleton>
        </div>
        {/* <div key="c">
          <LayoutSkeleton isEditingLayout={editingLayout} label={"C"}>
            C
          </LayoutSkeleton>
        </div> */}
      </ResponsiveGridLayout>
    </Show>
  );
};
