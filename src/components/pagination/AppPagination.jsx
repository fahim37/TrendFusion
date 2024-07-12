import { Box, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const pageSize = 6;

const AppPagination = ({ setPaginationItems, items, value }) => {
  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });

  useEffect(() => {
    const filteredItems = items.filter((item) => {
      if (value === "all") return true;
      return item.attributes.category === value;
    });

    setPagination((prev) => ({
      ...prev,
      count: filteredItems.length,
    }));

    const paginatedItems = filteredItems.slice(pagination.from, pagination.to);
    setPaginationItems(paginatedItems);
  }, [pagination.from, pagination.to, items, value]);

  const handleChange = (event, page) => {
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;
    setPagination({ ...pagination, from: from, to: to });
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      margin={"20px 0"}
    >
      <Pagination
        count={Math.ceil(pagination.count / pageSize)}
        onChange={handleChange}
        color="secondary"
      />
    </Box>
  );
};

export default AppPagination;
