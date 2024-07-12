import { Box, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import service from "../../services";

const pageSize = 6;

const AppPagination = ({ setPaginationItems }) => {
  // useEffect(()=>{
  //    const fetchData = async () =>{
  //     try{
  //         const result = await service.getData()
  //         console.log(result.data.length)
  //     } catch (error){
  //         console.log(error)
  //     }
  //    }
  //    fetchData()
  // },[])
  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });
  const items = useSelector((state) => state.cart.items);
  const paginationItems = items.slice(pagination.from, pagination.to);

  const handleChange = (event, page) => {
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;
    setPagination({ ...pagination, from: from, to: to });
    console.log(paginationItems.length);
  };
  useEffect(() => {
    setPagination({ ...pagination, count: items.length });
    setPaginationItems(paginationItems);
    console.log(paginationItems);
  }, [pagination.from, pagination.to]);

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
