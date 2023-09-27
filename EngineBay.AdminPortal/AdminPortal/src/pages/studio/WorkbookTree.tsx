import React, { useMemo, useState } from "react";
import { Blueprint, ElementType } from "../../lib";
import { SelectedElement } from "./SelectedElement";
import { useRecordContext } from "react-admin";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeDataNode, TreeNode } from "./TreeNode";

export const WorkbookTree = ({
  //   selectedElement,
  onBlueprintSelected,
  onElementSelected,
}: {
  //   selectedElement?: SelectedElement;
  onBlueprintSelected: (bluePrint: Blueprint) => void;
  onElementSelected: (selectedElement: SelectedElement) => void;
}): JSX.Element => {
  const workbook = useRecordContext();
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [blueprintIdDictionary, setBlueprintIdDictionary] = useState<
    Record<string, string>
  >({});
  const [elementTypeDictionary, setElementTypeDictionary] = useState<
    Record<string, ElementType>
  >({});
  const [elementIdDictionary, setElementIdDDictionary] = useState<
    Record<string, string>
  >({});

  useMemo(() => {
    if (workbook) {
      const updatedTreeData: TreeDataNode[] = workbook.blueprints.map(
        (blueprint: Blueprint) => {
          const expressionBlueprintChildren =
            blueprint.expressionBlueprints.map((expressionBlueprint) => {
              return {
                nodeId: expressionBlueprint.id,
                label: expressionBlueprint.expression,
              };
            });

          const dataVariableBlueprintChildren =
            blueprint.dataVariableBlueprints.map((dataVariableBlueprint) => {
              return {
                nodeId: dataVariableBlueprint.id,
                label: dataVariableBlueprint.name,
              };
            });

          const dataTableBlueprintChildren = blueprint.dataTableBlueprints.map(
            (dataTableBlueprint) => {
              return {
                nodeId: dataTableBlueprint.id,
                label: dataTableBlueprint.name,
              };
            }
          );

          const triggerBlueprintChildren = blueprint.triggerBlueprints.map(
            (triggerBlueprint) => {
              return {
                nodeId: triggerBlueprint.id,
                label: triggerBlueprint.name,
              };
            }
          );

          const children = [];

          if (dataVariableBlueprintChildren.length > 0) {
            children.push({
              nodeId: `${blueprint.id}-data-variable-blueprints`,
              label: `Data Variables`,
              children: dataVariableBlueprintChildren,
            });
          }

          if (dataTableBlueprintChildren.length > 0) {
            children.push({
              nodeId: `${blueprint.id}-data-table-blueprints`,
              label: `Data Tables`,
              children: dataTableBlueprintChildren,
            });
          }

          if (expressionBlueprintChildren.length > 0) {
            children.push({
              nodeId: `${blueprint.id}-expression-blueprints`,
              label: `Expressions`,
              children: expressionBlueprintChildren,
            });
          }

          if (triggerBlueprintChildren.length > 0) {
            children.push({
              nodeId: `${blueprint.id}-trigger-blueprints`,
              label: `Triggers`,
              children: triggerBlueprintChildren,
            });
          }
          return {
            nodeId: blueprint.id,
            label: blueprint.name,
            children: children,
          };
        }
      );

      setTreeData(updatedTreeData);
    }
  }, [workbook]);

  useMemo(() => {
    if (workbook) {
      for (const blueprint of workbook.blueprints) {
        blueprintIdDictionary[blueprint.id] = blueprint.id;
        blueprintIdDictionary[`${blueprint.id}-expression-blueprints`] =
          blueprint.id;
        blueprintIdDictionary[`${blueprint.id}-data-variable-blueprints`] =
          blueprint.id;
        blueprintIdDictionary[`${blueprint.id}-trigger-blueprints`] =
          blueprint.id;

        elementIdDictionary[blueprint.id] = blueprint.id;
        elementIdDictionary[`${blueprint.id}-expression-blueprints`] =
          blueprint.id;
        elementIdDictionary[`${blueprint.id}-data-variable-blueprints`] =
          blueprint.id;
        elementIdDictionary[`${blueprint.id}-trigger-blueprints`] =
          blueprint.id;

        elementTypeDictionary[blueprint.id] = ElementType.Blueprint;
        elementTypeDictionary[`${blueprint.id}-expression-blueprints`] =
          ElementType.Blueprint;
        elementTypeDictionary[`${blueprint.id}-data-variable-blueprints`] =
          ElementType.Blueprint;
        elementTypeDictionary[`${blueprint.id}-trigger-blueprints`] =
          ElementType.Blueprint;
        for (const expressionBlueprint of blueprint.expressionBlueprints) {
          blueprintIdDictionary[expressionBlueprint.id] = blueprint.id;
          elementIdDictionary[expressionBlueprint.id] = expressionBlueprint.id;
          elementTypeDictionary[expressionBlueprint.id] =
            ElementType.Expression;
        }
        for (const dataTableBlueprint of blueprint.dataTableBlueprints) {
          blueprintIdDictionary[dataTableBlueprint.id] = blueprint.id;
          elementIdDictionary[dataTableBlueprint.id] = dataTableBlueprint.id;
          elementTypeDictionary[dataTableBlueprint.id] = ElementType.DataTable;
        }
        for (const dataVariableBlueprint of blueprint.dataVariableBlueprints) {
          blueprintIdDictionary[dataVariableBlueprint.id] = blueprint.id;
          elementIdDictionary[dataVariableBlueprint.id] =
            dataVariableBlueprint.id;
          elementTypeDictionary[dataVariableBlueprint.id] =
            ElementType.DataVariable;
        }
        for (const triggerBlueprint of blueprint.triggerBlueprints) {
          blueprintIdDictionary[triggerBlueprint.id] = blueprint.id;
          elementIdDictionary[triggerBlueprint.id] = triggerBlueprint.id;
          elementTypeDictionary[triggerBlueprint.id] = ElementType.Trigger;
        }
      }
      setBlueprintIdDictionary(blueprintIdDictionary);
      setElementIdDDictionary(elementIdDictionary);
      setElementTypeDictionary(elementTypeDictionary);
    }
  }, [
    workbook,
    blueprintIdDictionary,
    elementIdDictionary,
    elementTypeDictionary,
  ]);

  const onSelect = (_: React.SyntheticEvent, nodeIds: string | string[]) => {
    const selectedNodeId = nodeIds as string;

    const selectedBlueprintId = blueprintIdDictionary[selectedNodeId];
    const selectedElementId = elementIdDictionary[selectedNodeId];
    const selectedElementType = elementTypeDictionary[selectedNodeId];
    const selectedBlueprint = workbook?.blueprints.find(
      (x: Blueprint) => x.id === selectedBlueprintId
    );

    if (selectedBlueprint) {
      onBlueprintSelected(selectedBlueprint);
    }

    if (selectedElementId && selectedElementType) {
      onElementSelected({
        elementId: selectedElementId,
        type: selectedElementType,
      });
    }
  };

  if (!workbook) return <></>;

  return (
    <div>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        onNodeSelect={onSelect}
        sx={{ overflowY: "auto" }}
      >
        {treeData && <TreeNode nodes={treeData} />}
      </TreeView>
    </div>
  );
};
