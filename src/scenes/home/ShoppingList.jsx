import { useEffect, useRef, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Item from "../../components/Item";
import { CircularProgress, TextField, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { addSearchText, setItems } from "../../state";
import AppPagination from "../../components/pagination/AppPagination";

const usePagination = (items, searchText) => {
  const [paginationItems, setPaginationItems] = useState([]);

  useEffect(() => {
    // Update pagination items whenever items or searchText change
    if (searchText.length > 0) {
      const filteredItems = items.filter((item) =>
        item.attributes.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setPaginationItems(filteredItems);
    } else {
      setPaginationItems(items);
    }
  }, [items, searchText]);

  return [paginationItems, setPaginationItems];
};

const ShoppingList = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("all");
  const [loading, setLoading] = useState(true);
  const items = useSelector((state) => state.cart.items);
  const searchText = useSelector((state) => state.cart.searchText);
  const breakPoint = useMediaQuery("(min-width:600px)");
  const productRef = useRef(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onAddSearchText = (val) => {
    dispatch(addSearchText(val));
  };

  const [paginationItems, setPaginationItems] = usePagination(
    items,
    searchText
  );

  async function getItems() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/items?populate=image`,
        { method: "GET" }
      );
      const itemsJson = await response.json();
      dispatch(setItems(itemsJson.data));
      setLoading(false);
    } catch (e) {
      console.log(`error : ${e.message}`);
    }
  }

  useEffect(() => {
    getItems();
  }, []);

  const topRatedItems = paginationItems.filter(
    (item) => item.attributes.category === "topRated"
  );
  const newArrivalsItems = paginationItems.filter(
    (item) => item.attributes.category === "newArrivals"
  );
  const bestSellersItems = paginationItems.filter(
    (item) => item.attributes.category === "bestSellers"
  );
  const displayedItems = paginationItems.slice(0, 6);

  return (
    <>
      <Box width={"80%"} margin={"80px auto"} id="products" ref={productRef}>
        <Typography variant="h3" textAlign={"center"}>
          Featured <b>Products</b>
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Box
            flexGrow={1}
            display="flex"
            justifyContent="center"
            margin={breakPoint ? "0 0 0 13%" : "0"}
          >
            <Tabs
              textColor="primary"
              indicatorColor="primary"
              value={value}
              onChange={handleChange}
              TabIndicatorProps={{
                sx: { display: breakPoint ? "block" : "none" },
              }}
              sx={{
                m: "25px",
                "& .MuiTabs-flexContainer": {
                  flexWrap: "wrap",
                },
              }}
            >
              <Tab label="ALL" value="all" />
              <Tab label="NEW ARRIVALS" value="newArrivals" />
              <Tab label="BEST SELLERS" value="bestSellers" />
              <Tab label="TOP RATED" value="topRated" />
            </Tabs>
          </Box>
          <Box
            alignItems={"center"}
            justifyContent={"center"}
            margin={!breakPoint ? "0" : "0 4% 0 0"}
          >
            <TextField
              onChange={(e) => onAddSearchText(e.target.value)}
              label="Search..."
              variant="outlined"
            />
          </Box>
        </Box>

        {loading && (
          <Box textAlign={"center"}>
            <CircularProgress color="secondary" />
          </Box>
        )}

        {!loading && (
          <Box
            margin="0 auto"
            display="grid"
            gridTemplateColumns="repeat(auto-fill, 300px)"
            justifyContent="space-around"
            rowGap="20px"
            columnGap="1.33%"
          >
            {value === "all" &&
              displayedItems.map((item) => (
                <Item item={item} key={`${item.attributes.name}-${item.id}`} />
              ))}
            {value === "newArrivals" &&
              newArrivalsItems.map((item) => (
                <Item item={item} key={`${item.attributes.name}-${item.id}`} />
              ))}
            {value === "bestSellers" &&
              bestSellersItems.map((item) => (
                <Item item={item} key={`${item.attributes.name}-${item.id}`} />
              ))}
            {value === "topRated" &&
              topRatedItems.map((item) => (
                <Item item={item} key={`${item.attributes.name}-${item.id}`} />
              ))}
          </Box>
        )}
        <AppPagination
          setPaginationItems={setPaginationItems}
          items={items}
          value={value}
        />
      </Box>
    </>
  );
};
export default ShoppingList;
