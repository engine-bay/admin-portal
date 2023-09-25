export enum DataVariableType {
    FLOAT = "float",
    STRING = "string",
    BOOL = "bool",
    DATETIME = "datetime",
    DATATABLE = "datatable"
}


export interface Workbook {
    id?: string;
    name?: string;
    description?: string;
    blueprints: Blueprint[]
}

export interface Blueprint {
    id?: string;
    name: string;
    description?: string;
    expressionBlueprints: ExpressionBlueprint[];
    dataVariableBlueprints: DataVariableBlueprint[];
    dataTableBlueprints: DataTableBlueprint[];
    triggerBlueprints: TriggerBlueprint[];
}

export interface ExpressionBlueprint {
    id?: string;
    expression: string;
    objective: string;
    inputDataVariableBlueprints: InputDataVariableBlueprint[];
    inputDataTableBlueprints: InputDataTableBlueprint[];
    outputDataVariableBlueprint: OutputDataVariableBlueprint;
}

export interface InputDataTableBlueprint {
    id?: string;
    name: string;
    namespace: string;
}

export interface DataVariableBlueprint {
    id?: string;
    name: string;
    namespace: string;
    description?: string;
    type: string;
    defaultValue?: string;
}

export interface TriggerBlueprint {
    id?: string;
    name: string;
    description?: string;
    triggerExpressionBlueprints: TriggerExpressionBlueprint[];
    outputDataVariableBlueprint: OutputDataVariableBlueprint;
}

export interface InputDataVariableBlueprint {
    id?: string;
    name: string;
    namespace: string;
    type: string;
}

export interface OutputDataVariableBlueprint {
    id?: string;
    name: string;
    namespace: string;
    type: string;
}

export interface TriggerExpressionBlueprint {
    id?: string;
    expression: string;
    objective: string;
    inputDataVariableBlueprint: InputDataVariableBlueprint
}

export interface DataTableBlueprint {
    id?: string;
    name: string;
    namespace: string;
    description?: string;
    inputDataVariableBlueprints: InputDataVariableBlueprint[];
    dataTableColumnBlueprints: DataTableColumnBlueprint[];
    dataTableRowBlueprints: DataTableRowBlueprint[];
}

export interface DataTableColumnBlueprint {
    id?: string;
    name: string;
    type: string;
}

export interface DataTableRowBlueprint {
    id?: string;
    dataTableCellBlueprints: DataTableCellBlueprint[];
}

export interface DataTableCellBlueprint {
    id?: string;
    key: string;
    name: string;
    namespace: string;
    value: string;
}

export const cellDataTypeMap: Record<string, DataVariableType> = {
    b: DataVariableType.BOOL,
    n: DataVariableType.FLOAT,
    d: DataVariableType.DATETIME,
    s: DataVariableType.STRING,
    e: DataVariableType.STRING, //error
    z: DataVariableType.STRING // stub (blank cell)
}

export type Cell = {
    cellReference: string
    namespace: string,
    formula: string,
    value: string,
    type: DataVariableType,
    isDynamic: boolean
}