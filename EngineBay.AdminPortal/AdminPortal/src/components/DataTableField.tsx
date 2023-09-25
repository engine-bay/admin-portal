import { useRecordContext } from "react-admin";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

type DataTableFieldProps = {
  label?: string | boolean;
};

type DataTableColumn = {
  name: string;
};

type DataTableRow = {
  dataTableCellBlueprints: DataTableCell[];
};

type DataTableCell = {
  value: string;
};

export const DataTableField = (props: DataTableFieldProps) => {
  const record = useRecordContext(props);

  const { dataTableRowBlueprints, dataTableColumnBlueprints } = record;

  return record ? (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {dataTableColumnBlueprints.map(
              (columnBlueprint: DataTableColumn, index: number) => {
                return (
                  <TableCell key={index}>{columnBlueprint.name}</TableCell>
                );
              }
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataTableRowBlueprints.map(
            (rowBlueprint: DataTableRow, rowIndex: number) => {
              return (
                <TableRow key={rowIndex}>
                  {rowBlueprint.dataTableCellBlueprints.map(
                    (cellBlueprint: DataTableCell, cellIndex: number) => {
                      return (
                        <TableCell key={cellIndex}>
                          {cellBlueprint.value}
                        </TableCell>
                      );
                    }
                  )}
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
    </TableContainer>
  ) : null;
};

DataTableField.defaultProps = { label: "Data Table" };
