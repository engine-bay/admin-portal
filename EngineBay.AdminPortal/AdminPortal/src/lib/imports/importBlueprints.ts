import { read, utils } from "xlsx";
import { generateBlueprintsFromCells } from "./generateBlueprintsFromCells";
import { Blueprint, Cell, cellDataTypeMap, DataVariableBlueprint } from "./imports.types";

export const importBlueprints = async (file: Blob) => {
    return new Promise<Blueprint[]>((resolve) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file)

        reader.onload = () => {
            const wb = read(reader.result);

            let blueprints: Blueprint[] = [];

            // get all the cells
            const allCells: Cell[] = [];

            for (const worksheetName of wb.SheetNames) {
                const sheet = wb.Sheets[worksheetName]
                const cellFormulas = utils.sheet_to_formulae(sheet);

                for (const cellFormula of cellFormulas) {

                    let cleanedCellFormula = cellFormula;

                    for (const worksheetNameToBeReplaced of wb.SheetNames) {
                        const namespace = worksheetNameToBeReplaced.replace(' ', '_');
                        cleanedCellFormula = cleanedCellFormula.replace(new RegExp(`'${worksheetNameToBeReplaced}'!`, 'g'), `${namespace}_`);
                        cleanedCellFormula = cleanedCellFormula.replace(new RegExp(`${worksheetNameToBeReplaced}!`, 'g'), `${namespace}_`);
                    }

                    let cellReference = '';
                    let cellExpression = '';

                    if (cleanedCellFormula.indexOf(`='`) > 0) {
                        // deal with string literal values
                        cellReference = cleanedCellFormula.split(`='`)[0];
                        cellExpression = cleanedCellFormula.split(`='`)[1];
                    } else {
                        // deal everything else
                        cellReference = cleanedCellFormula.split(`=`)[0];
                        cellExpression = cleanedCellFormula.split(`=`)[1];
                    }

                    const cellObject = sheet[cellReference];

                    allCells.push({
                        cellReference,
                        namespace: worksheetName.replace(' ', '_'),
                        formula: cleanedCellFormula,
                        value: cellExpression,
                        type: cellDataTypeMap[cellObject.t],
                        isDynamic: cellObject.f !== undefined
                    })
                }
            }

            // now get the worksheet specific cells

            for (const worksheetName of wb.SheetNames) {
                const sheet = wb.Sheets[worksheetName]
                const cellFormulas = utils.sheet_to_formulae(sheet);

                const cells: Cell[] = [];

                for (const cellFormula of cellFormulas) {

                    let cleanedCellFormula = cellFormula;

                    for (const worksheetNameToBeReplaced of wb.SheetNames) {
                        const namespace = worksheetNameToBeReplaced.replace(' ', '_');
                        cleanedCellFormula = cleanedCellFormula.replace(new RegExp(`'${worksheetNameToBeReplaced}'!`, 'g'), `${namespace}_`);
                        cleanedCellFormula = cleanedCellFormula.replace(new RegExp(`${worksheetNameToBeReplaced}!`, 'g'), `${namespace}_`);
                    }

                    let cellReference = '';
                    let cellExpression = '';

                    if (cleanedCellFormula.indexOf(`='`) > 0) {
                        // deal with string literal values
                        cellReference = cleanedCellFormula.split(`='`)[0];
                        cellExpression = cleanedCellFormula.split(`='`)[1];
                    } else {
                        // deal everything else
                        cellReference = cleanedCellFormula.split(`=`)[0];
                        cellExpression = cleanedCellFormula.split(`=`)[1];
                    }

                    const cellObject = sheet[cellReference];

                    cells.push({
                        cellReference,
                        namespace: worksheetName.replace(' ', '_'),
                        formula: cleanedCellFormula,
                        value: cellExpression,
                        type: cellDataTypeMap[cellObject.t],
                        isDynamic: cellObject.f !== undefined
                    })
                }

                blueprints = [...generateBlueprintsFromCells(wb, worksheetName, allCells, cells), ...blueprints]
            }

            // deduplicate all the blueprint data variables

            for (const blueprint of blueprints) {
                const uniqueDataVariables: DataVariableBlueprint[] = [];
                for (const dataVariable of blueprint.dataVariableBlueprints) {
                    if (!uniqueDataVariables.some(x => (dataVariable.name === x.name) && (dataVariable.namespace === x.namespace))) {
                        uniqueDataVariables.push(dataVariable)
                    }
                }

                blueprint.dataVariableBlueprints = uniqueDataVariables;
            }

            

            resolve(blueprints);
        };
    })

}