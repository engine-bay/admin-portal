import { utils, WorkBook as SheetJSWorkbook } from "xlsx";
import { Blueprint, DataVariableBlueprint, ExpressionBlueprint, TriggerBlueprint, InputDataVariableBlueprint, DataTableBlueprint, DataTableRowBlueprint, InputDataTableBlueprint, Cell, cellDataTypeMap } from './imports.types';
import { DataVariableType } from "../enums";

export const generateBlueprintsFromCells = (wb: SheetJSWorkbook, worksheetName: string, allCells: Cell[], cells: Cell[]) => {

    const blueprints: Blueprint[] = [];
    const expressionBlueprints: ExpressionBlueprint[] = [];
    const dataVariableBlueprints: DataVariableBlueprint[] = [];
    const dataTableBlueprints: DataTableBlueprint[] = [];
    const triggerBlueprint: TriggerBlueprint[] = [];

    const allDataVariableBlueprints: DataVariableBlueprint[] = [];

    // generate the set of all data variables

    for (const cell of allCells) {

        if (cell.isDynamic) {
            allDataVariableBlueprints.push({
                name: `${cell.namespace}_${cell.cellReference}`,
                namespace: cell.namespace,
                description: `Part of the evaluation of ${cell.formula}`,
                type: cell.type
            })
        } else {
            allDataVariableBlueprints.push({
                name: `${cell.namespace}_${cell.cellReference}`,
                namespace: cell.namespace,
                description: `Part of the evaluation of ${cell.formula}`,
                type: cell.type,
                defaultValue: cell.value
            })
        }
    }

    // generate the set of blueprint specific cells
    for (const cell of cells) {

        if (cell.isDynamic) {
            dataVariableBlueprints.push({
                name: cell.cellReference,
                namespace: cell.namespace,
                description: `Part of the evaluation of ${cell.formula}`,
                type: cell.type
            })
        } else {
            dataVariableBlueprints.push({
                name: cell.cellReference,
                namespace: cell.namespace,
                description: `Part of the evaluation of ${cell.formula}`,
                type: cell.type,
                defaultValue: cell.value
            })
        }
    }

    // generate the set of data table blueprints
    for (const cell of cells) {
        if (cell.isDynamic && cell.value.includes(":")) {
            console.log("Cell has a range in it:")
            console.log(cell)
            const parts = cell.value.split(':');
            const pairs = parts.length / 2;
            for (let i = 0; i < pairs; i = i + 2) {
                const left = parts[i]
                const right = parts[i + 1]

                const leftIndex = (left.split("").reverse().join("").match(/[*?+^${}[\](),.|\\]/) || {}).index || 0
                const rightIndex = (right.match(/[*?+^${}[\](),.|\\]/) || {}).index || 0

                const from = left.substring(left.length - leftIndex, left.length);
                const to = right.substring(0, rightIndex);

                const { s: start, e: end } = utils.decode_range(`${from}:${to}`);

                const dataTableBlueprint: DataTableBlueprint = {
                    name: `${from}_${to}`,
                    namespace: cell.namespace,
                    description: `Data table generated from range '${from}:${to}'`,
                    inputDataVariableBlueprints: [],
                    dataTableColumnBlueprints: [],
                    dataTableRowBlueprints: []
                }

                // create the columns
                for (let i = start.c; i <= end.c; i++) {
                    const key = utils.encode_range({ s: { c: i, r: start.r }, e: { c: i, r: start.r } })
                    const cellObject = wb.Sheets[worksheetName][key];
                    dataTableBlueprint.dataTableColumnBlueprints.push({
                        name: utils.encode_col(i),
                        type: cellDataTypeMap[cellObject.t],
                    })
                }

                // create the cells of data
                for (let j = start.r; j <= end.r; j++) {
                    const dataTableRowBlueprint: DataTableRowBlueprint = {
                        dataTableCellBlueprints: []
                    }
                    for (let i = start.c; i <= end.c; i++) {
                        const key = utils.encode_range({ s: { c: i, r: j }, e: { c: i, r: j } })
                        const cellObject = wb.Sheets[worksheetName][key];
                        const value = cellObject.w;
                        dataTableRowBlueprint.dataTableCellBlueprints.push({
                            key: utils.encode_col(i),
                            name: key,
                            namespace: cell.namespace,
                            value
                        })

                        dataTableBlueprint.inputDataVariableBlueprints.push({
                            name: key,
                            namespace: cell.namespace,
                            type: cellDataTypeMap[cellObject.t],
                        })
                    }
                    dataTableBlueprint.dataTableRowBlueprints.push(dataTableRowBlueprint);
                }

                dataTableBlueprints.push(dataTableBlueprint);

                dataVariableBlueprints.push({
                    name: dataTableBlueprint.name,
                    namespace: dataTableBlueprint.namespace,
                    description: `Data variable to access or reference the data table ${dataTableBlueprint.name}`,
                    type: DataVariableType.DATATABLE
                })

                cell.value = cell.value.replace(`${from}:${to}`, `${from}_${to}`);
            }

        }
    }

    // generate the set of expression blue prints
    for (const cell of cells) {

        if (cell.isDynamic) {

            const inputDataVariableBlueprints: InputDataVariableBlueprint[] = [];
            const inputDataTableBlueprints: InputDataTableBlueprint[] = [];

            // add all the local sheet references
            for (const dataVariableBlueprint of dataVariableBlueprints) {
                if (cell.namespace === dataVariableBlueprint.namespace && cell.value.includes(dataVariableBlueprint.name)) {
                    let localOnlyCellValue = cell.value;

                    // remove all the global references so that we're only testing for the local ones
                    for (const globalDataVariableBlueprint of allDataVariableBlueprints) {
                        localOnlyCellValue = localOnlyCellValue.replace(globalDataVariableBlueprint.name, '');
                    }

                    // remove all the data table references so that we're only testing for the local ones
                    for (const dataTableBlueprint of dataTableBlueprints) {
                        localOnlyCellValue = localOnlyCellValue.replace(dataTableBlueprint.name, '');
                    }

                    if (localOnlyCellValue.includes(dataVariableBlueprint.name)) {
                        inputDataVariableBlueprints.push({
                            name: dataVariableBlueprint.name,
                            namespace: dataVariableBlueprint.namespace,
                            type: dataVariableBlueprint.type
                        })
                    }
                }
            }

            // add all the global sheet references
            for (const dataVariableBlueprint of allDataVariableBlueprints) {

                if (cell.namespace !== dataVariableBlueprint.namespace && cell.value.includes(dataVariableBlueprint.name)) {
                    inputDataVariableBlueprints.push({
                        name: dataVariableBlueprint.name,
                        namespace: dataVariableBlueprint.namespace,
                        type: dataVariableBlueprint.type
                    })

                    dataVariableBlueprints.push(dataVariableBlueprint);

                    dataVariableBlueprints.push({
                        name: dataVariableBlueprint.name.replace(`${dataVariableBlueprint.namespace}_`, ''),
                        namespace: dataVariableBlueprint.namespace,
                        description: dataVariableBlueprint.description,
                        type: dataVariableBlueprint.type,
                        defaultValue: dataVariableBlueprint.defaultValue
                    })

                    expressionBlueprints.push({
                        expression: dataVariableBlueprint.name.replace(`${dataVariableBlueprint.namespace}_`, ''),
                        objective: `An alias to access values of ${dataVariableBlueprint.name.replace(`${dataVariableBlueprint.namespace}_`, '')} in the '${dataVariableBlueprint.namespace}' namespace as '${dataVariableBlueprint.name}`,
                        inputDataTableBlueprints: [],
                        inputDataVariableBlueprints: [{
                            name: dataVariableBlueprint.name.replace(`${dataVariableBlueprint.namespace}_`, ''),
                            namespace: dataVariableBlueprint.namespace,
                            type: dataVariableBlueprint.type
                        }],
                        outputDataVariableBlueprint: {
                            name: dataVariableBlueprint.name,
                            namespace: dataVariableBlueprint.namespace,
                            type: dataVariableBlueprint.type
                        }
                    })
                }
            }

            // add all the data table references
            for (const dataTableBlueprint of dataTableBlueprints) {
                if (cell.value.includes(dataTableBlueprint.name)) {
                    inputDataTableBlueprints.push({
                        name: dataTableBlueprint.name,
                        namespace: dataTableBlueprint.namespace
                    })
                }
            }

            expressionBlueprints.push({
                expression: cell.value,
                objective: `Evaluate the formula '${cell.formula}' from cell '${cell.cellReference}'`,
                inputDataTableBlueprints: inputDataTableBlueprints,
                inputDataVariableBlueprints: inputDataVariableBlueprints,
                outputDataVariableBlueprint: {
                    name: cell.cellReference,
                    namespace: cell.namespace,
                    type: cell.type
                }
            })
        }
    }


    blueprints.push({
        name: worksheetName,
        description: `Generated from the '${worksheetName}' worksheet of an excel file`,
        expressionBlueprints: expressionBlueprints,
        dataVariableBlueprints: dataVariableBlueprints,
        dataTableBlueprints: dataTableBlueprints,
        triggerBlueprints: triggerBlueprint
    })

    return blueprints;
}