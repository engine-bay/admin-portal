import { Skeleton } from "@mui/material";
import { ReactElement } from "react";

export type LayoutSkeletonProps = {
  isEditingLayout: boolean;
  children: ReactElement;
  label?: string;
};

export const LayoutSkeleton = (props: LayoutSkeletonProps) => {
  const { isEditingLayout, children, label } = props;

  if (isEditingLayout) {
    return (
      <Skeleton
        variant="rounded"
        height={"100%"}
        width={"100%"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {label}
      </Skeleton>
    );
  }

  return children;
};
