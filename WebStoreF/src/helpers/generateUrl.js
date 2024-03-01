function generateUrl(storeName, storeId) {
    navigator.clipboard.writeText(
      import.meta.env.VITE_DOMAIN + "/store/" + storeName + "/" + storeId
    );
}

export default generateUrl