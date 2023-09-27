import { DataVariableType } from "../enums";

export type Workbook = {
    id?: string;
    name?: string;
    description?: string;
    blueprints: Blueprint[]
}

export type Blueprint = {
    id?: string;
    name: string;
    description?: string;
    expressionBlueprints: ExpressionBlueprint[];
    dataVariableBlueprints: DataVariableBlueprint[];
    dataTableBlueprints: DataTableBlueprint[];
    triggerBlueprints: TriggerBlueprint[];
}

export type ExpressionBlueprint = {
    id?: string;
    expression: string;
    objective: string;
    inputDataVariableBlueprints: InputDataVariableBlueprint[];
    inputDataTableBlueprints: InputDataTableBlueprint[];
    outputDataVariableBlueprint: OutputDataVariableBlueprint;
}

export type InputDataTableBlueprint = {
    id?: string;
    name: string;
    namespace: string;
}

export type DataVariableBlueprint = {
    id?: string;
    name: string;
    namespace: string;
    description?: string;
    type: string;
    defaultValue?: string;
}

export type TriggerBlueprint = {
    id?: string;
    name: string;
    description?: string;
    triggerExpressionBlueprints: TriggerExpressionBlueprint[];
    outputDataVariableBlueprint: OutputDataVariableBlueprint;
}

export type InputDataVariableBlueprint = {
    id?: string;
    name: string;
    namespace: string;
    type: string;
}

export type OutputDataVariableBlueprint = {
    id?: string;
    name: string;
    namespace: string;
    type: string;
}

export type TriggerExpressionBlueprint = {
    id?: string;
    expression: string;
    objective: string;
    inputDataVariableBlueprint: InputDataVariableBlueprint
}

export type DataTableBlueprint = {
    id?: string;
    name: string;
    namespace: string;
    description?: string;
    inputDataVariableBlueprints: InputDataVariableBlueprint[];
    dataTableColumnBlueprints: DataTableColumnBlueprint[];
    dataTableRowBlueprints: DataTableRowBlueprint[];
}

export type DataTableColumnBlueprint = {
    id?: string;
    name: string;
    type: string;
}

export type DataTableRowBlueprint = {
    id?: string;
    dataTableCellBlueprints: DataTableCellBlueprint[];
}

export type DataTableCellBlueprint = {
    id?: string;
    key: string;
    name: string;
    namespace: string;
    value: string;
}

export type Cell = {
    cellReference: string
    namespace: string,
    formula: string,
    value: string,
    type: DataVariableType,
    isDynamic: boolean
}

export const cellDataTypeMap: Record<string, DataVariableType> = {
    b: DataVariableType.BOOL,
    n: DataVariableType.FLOAT,
    d: DataVariableType.DATETIME,
    s: DataVariableType.STRING,
    e: DataVariableType.STRING, //error
    z: DataVariableType.STRING // stub (blank cell)
}