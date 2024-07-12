import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Item from "../../components/Item";
import { CircularProgress, TextField, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { addSearchText, setItems } from "../../state";
import AppPagination from "../../components/pagination/AppPagination";

const ShoppingList = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("all");
  const [loading, setLoading] = useState(true);
  const items = useSelector((state) => state.cart.items);
  const searchText = useSelector((state) => state.cart.searchText);
  console.log("🚀 ~ ShoppingList ~ searchText:", searchText);
  const [paginationItems, setPaginationItems] = useState([]);
  //console.log("🚀 ~ items:", items)

  const breakPoint = useMediaQuery("(min-width:600px)");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onAddSearchText = (val) => {
    dispatch(addSearchText(val));
  };

  async function getItems() {
    try {
      const items = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/items?populate=image`,
        { method: "GET" }
      );
      const itemsJson = await items.json();

      let filteredData = itemsJson.data; // Initially assign all items

      if (searchText.length > 0) {
        filteredData = itemsJson.data.filter((item) =>
          item.attributes.name.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      dispatch(setItems(filteredData));
      console.log("🚀 ~ getItems ~ itemsJson.data:", itemsJson.data);
      setLoading(false);
    } catch (e) {
      console.log(`error : ${e.message}`);
    }
  }

  useEffect(() => {
    getItems();
  }, [searchText]);

  const topRatedItems = items.filter(
    (item) => item.attributes.category === "topRated"
  );
  const newArrivalsItems = items.filter(
    (item) => item.attributes.category === "newArrivals"
  );
  const bestSellersItems = items.filter(
    (item) => item.attributes.category === "bestSellers"
  );

  return (
    <>
      <Box width={"80%"} margin={"80px auto"}>
        <Typography variant="h3" textAlign={"center"}>
          Featured <b>Products</b>
        </Typography>
        <Tabs
          textColor="primary"
          indicatorColor="primary"
          value={value}
          onChange={handleChange}
          centered
          TabIndicatorProps={{ sx: { display: breakPoint ? "block" : "none" } }}
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
        {/* ----------Search field----------------- */}
        <TextField
          onChange={(e) => onAddSearchText(e.target.value)}
          label="Outlined"
          variant="outlined"
        />

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
              items.map((item) => (
                <Item item={item} key={`${item.name}-${item.id}`} />
              ))}
            {value === "newArrivals" &&
              newArrivalsItems.map((item) => (
                <Item item={item} key={`${item.name}-${item.id}`} />
              ))}
            {value === "bestSellers" &&
              bestSellersItems.map((item) => (
                <Item item={item} key={`${item.name}-${item.id}`} />
              ))}
            {value === "topRated" &&
              topRatedItems.map((item) => (
                <Item item={item} key={`${item.name}-${item.id}`} />
              ))}
          </Box>
        )}
        {value === "all" && (
          <AppPagination setPaginationItems={(p) => setPaginationItems(p)} />
        )}
      </Box>
    </>
  );
};
export default ShoppingList;
