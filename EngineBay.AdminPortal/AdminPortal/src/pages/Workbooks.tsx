import { useMediaQuery, Theme } from "@mui/material";
import { List, SimpleList, Datagrid, TextField } from "react-admin";

export const WorkbookList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => record.description}
        />
      ) : (
        <Datagrid rowClick="edit">
          <TextField source="name" />
          <TextField source="description" />
        </Datagrid>
      )}
    </List>
  );
};
