import { useLocation } from "react-router-dom";

function Search() {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("keywords");
  console.log(search);
  return <h1>Search</h1>;
}

export default Search;
