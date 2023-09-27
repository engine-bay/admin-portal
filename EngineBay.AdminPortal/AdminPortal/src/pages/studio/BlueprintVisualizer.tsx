import { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  MiniMap,
  ReactFlowProvider,
  ConnectionLineType,
  useReactFlow,
  useNodesState,
  useEdgesState,
  Position,
  getOutgoers,
  getIncomers,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import { Blueprint, ElementType } from "../../lib";
import { SelectedElement } from "./SelectedElement";
import { v4 as uuidv4 } from "uuid";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 120;
const nodeHeight = 30;

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export type BlueprintVisualizerProps = {
  blueprint?: Blueprint;
  selectedElement?: SelectedElement;
  onElementSelected: (selectedElement: SelectedElement) => void;
};

const BlueprintVisualizerCanvas = ({
  blueprint,
  selectedElement,
}: BlueprintVisualizerProps): JSX.Element => {
  const { fitView } = useReactFlow();

  let initialNodes: Node[] = [];
  let initialEdges: Edge[] = [];

  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node>();

  useEffect(() => {
    initialNodes = [];
    initialEdges = [];

    if (blueprint) {
      for (const expressionBlueprint of blueprint.expressionBlueprints) {
        initialNodes.push({
          id: expressionBlueprint.id || uuidv4(),
          data: {
            label:
              expressionBlueprint.objective || expressionBlueprint.expression,
            type: ElementType.Blueprint,
          },
          position: { x: 0, y: 0 },
        });

        // map the inputs
        for (const inputDataVariableBlueprint of expressionBlueprint.inputDataVariableBlueprints) {
          const sourceDataVariableBlueprint =
            blueprint.dataVariableBlueprints.find(
              (x) =>
                x.name == inputDataVariableBlueprint.name &&
                x.namespace == inputDataVariableBlueprint.namespace
            );
          if (sourceDataVariableBlueprint) {
            initialEdges.push({
              id: `${sourceDataVariableBlueprint.id}-${expressionBlueprint.id}`,
              source: sourceDataVariableBlueprint.id || uuidv4(),
              target: expressionBlueprint.id || uuidv4(),
              animated: true,
            });
          }
        }

        // map the inputs
        for (const inputDataTableBlueprint of expressionBlueprint.inputDataTableBlueprints) {
          const sourceDataVariableBlueprint =
            blueprint.dataVariableBlueprints.find(
              (x) =>
                x.name == inputDataTableBlueprint.name &&
                x.namespace == inputDataTableBlueprint.namespace
            );
          if (sourceDataVariableBlueprint) {
            initialEdges.push({
              id: `${sourceDataVariableBlueprint.id}-${expressionBlueprint.id}`,
              source: sourceDataVariableBlueprint.id || uuidv4(),
              target: expressionBlueprint.id || uuidv4(),
              animated: true,
            });
          }
        }

        // map the output
        const targetDataVariableBlueprint =
          blueprint.dataVariableBlueprints.find(
            (x) =>
              x.name == expressionBlueprint.outputDataVariableBlueprint.name &&
              x.namespace ==
                expressionBlueprint.outputDataVariableBlueprint.namespace
          );
        if (targetDataVariableBlueprint) {
          initialEdges.push({
            id: `${expressionBlueprint.id}-${targetDataVariableBlueprint.id}`,
            source: expressionBlueprint.id || uuidv4(),
            target: targetDataVariableBlueprint.id || uuidv4(),
            animated: true,
          });
        }
      }

      for (const triggerBlueprint of blueprint.triggerBlueprints) {
        initialNodes.push({
          id: triggerBlueprint.id || uuidv4(),
          data: {
            label: triggerBlueprint.name,
            type: ElementType.Trigger,
          },
          position: { x: 0, y: 0 },
        });

        // map the inputs
        for (const triggerExpressionBlueprints of triggerBlueprint.triggerExpressionBlueprints) {
          const sourceDataVariableBlueprint =
            blueprint.dataVariableBlueprints.find(
              (x) =>
                x.name ==
                  triggerExpressionBlueprints.inputDataVariableBlueprint.name &&
                x.namespace ==
                  triggerExpressionBlueprints.inputDataVariableBlueprint
                    .namespace
            );
          if (sourceDataVariableBlueprint) {
            initialEdges.push({
              id: `${sourceDataVariableBlueprint.id}-${triggerBlueprint.id}`,
              source: sourceDataVariableBlueprint.id || uuidv4(),
              target: triggerBlueprint.id || uuidv4(),
              animated: true,
            });
          }
        }

        // map the output
        const targetDataVariableBlueprint =
          blueprint.dataVariableBlueprints.find(
            (x) =>
              x.name == triggerBlueprint.outputDataVariableBlueprint.name &&
              x.namespace ==
                triggerBlueprint.outputDataVariableBlueprint.namespace
          );
        if (targetDataVariableBlueprint) {
          initialEdges.push({
            id: `${triggerBlueprint.id}-${targetDataVariableBlueprint.id}`,
            source: triggerBlueprint.id || uuidv4(),
            target: targetDataVariableBlueprint.id || uuidv4(),
            animated: true,
          });
        }
      }

      for (const dataTableBlueprint of blueprint.dataTableBlueprints) {
        initialNodes.push({
          id: dataTableBlueprint.id || uuidv4(),
          data: {
            label: dataTableBlueprint.name,
            type: ElementType.DataTable,
          },
          position: { x: 0, y: 0 },
        });

        // map the inputs
        for (const inputDataVariableBlueprint of dataTableBlueprint.inputDataVariableBlueprints) {
          const sourceDataVariableBlueprint =
            blueprint.dataVariableBlueprints.find(
              (x) =>
                x.name == inputDataVariableBlueprint.name &&
                x.namespace == inputDataVariableBlueprint.namespace
            );
          if (sourceDataVariableBlueprint) {
            initialEdges.push({
              id: `${sourceDataVariableBlueprint.id}-${dataTableBlueprint.id}`,
              source: sourceDataVariableBlueprint.id || uuidv4(),
              target: dataTableBlueprint.id || uuidv4(),
              animated: true,
            });
          }
        }

        // map the output
        const targetDataVariableBlueprint =
          blueprint.dataVariableBlueprints.find(
            (x) =>
              x.name == dataTableBlueprint.name &&
              x.namespace == dataTableBlueprint.namespace
          );
        if (targetDataVariableBlueprint) {
          initialEdges.push({
            id: `${dataTableBlueprint.id}-${targetDataVariableBlueprint.id}`,
            source: dataTableBlueprint.id || uuidv4(),
            target: targetDataVariableBlueprint.id || uuidv4(),
            animated: true,
          });
        }
      }

      for (const dataVariableBlueprint of blueprint.dataVariableBlueprints) {
        initialNodes.push({
          id: dataVariableBlueprint.id || uuidv4(),
          data: {
            label: dataVariableBlueprint.name,
            type: ElementType.DataVariable,
          },
          position: { x: 0, y: 0 },
        });
      }
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );

    if (selectedElement) {
      const selectedNodeIndex = layoutedNodes.findIndex(
        (node) => node.id === selectedElement.elementId
      );
      const selectedNode = layoutedNodes[selectedNodeIndex];

      if (selectedNode) {
        selectedNode.style = { backgroundColor: "#e6f4ff" };
      }
      setSelectedNode(selectedNode);
    } else {
      setSelectedNode(undefined);
    }

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [blueprint, selectedElement]);

  useEffect(() => {
    if (selectedNode) {
      const outgoers = getOutgoers(selectedNode, nodes, edges);
      const incomers = getIncomers(selectedNode, nodes, edges);
      fitView({
        padding: 2,
        nodes: [selectedNode, ...outgoers, ...incomers],
      });
    } else {
      fitView({
        padding: 2,
        nodes,
      });
    }
  }, [selectedNode, nodes, edges, fitView]);

  const onNodeClick = (_: React.SyntheticEvent, node: Node) => {
    console.log("node: ", node);
    // const selectedNodeId: string = nodeIds;
    // const selectedBlueprintId = blueprintIdDictionary[selectedNodeId];
    // const selectedElementId = elementIdDictionary[selectedNodeId];
    // const selectedElementType = elementTypeDictionary[selectedNodeId];
    // const selectedBlueprint = workbook?.blueprints.find(
    //   (x: Blueprint) => x.id === selectedBlueprintId
    // );

    // if (selectedBlueprint) {
    //   onBlueprintSelected(selectedBlueprint);
    // }

    // if (selectedElementId && selectedElementType) {
    //   onElementSelected({
    //     elementId: selectedElementId,
    //     type: selectedElementType,
    //   });
    // }
  };

  if (!blueprint) return <></>;

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      snapToGrid={true}
      onlyRenderVisibleElements
      onNodeClick={onNodeClick}
      connectionLineType={ConnectionLineType.SmoothStep}
    >
      <MiniMap />
      <Background />
      <Controls />
    </ReactFlow>
  );
};

// wrapping with ReactFlowProvider is done outside of the component
export const BlueprintVisualizer = (props: BlueprintVisualizerProps) => {
  return (
    <ReactFlowProvider>
      <BlueprintVisualizerCanvas {...props} />
    </ReactFlowProvider>
  );
};
