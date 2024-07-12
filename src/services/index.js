import React from "react";

const service = {
  getData: async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/items?populate=image`,
      {
        method: "GET",
      }
    );
    const items = await response.json();
    return items;
  },
};

export default service;
