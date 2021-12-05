import axios from "axios";
import { useState, useEffect, useCallback } from "react";

const API_URL = "https://randomuser.me/api/";

function Users({ status, error, results }) {
  if (status === "rejected") {
    return error.message;
  }

  if (status === "pending") {
    return "Loading user...";
  }

  if (status === "idle") {
    return null;
  }

  if (status === "success") {
    return (
      <>
        {results.map((item) => (
          <div>
            <p>User: {`${item.name.first} ${item.name.last}`}</p>
            <p>Phone: {item.cell}</p>
            <p>Gender: {item.gender}</p>
          </div>
        ))}
      </>
    );
  }

  throw new Error("This should not happen");
}

function useAsync() {
  const [apiData, setApiData] = useState({
    status: "idle",
    error: null,
    results: [],
  });
  const [page, setPage] = useState(1);

  const memoizedCallApi = useCallback(async (internalPage) => {
    try {
      setApiData({ status: "pending" });
      const response = await axios.get(
        `${API_URL}?page=${internalPage}&results=10`
      );
      setApiData({
        status: "success",
        results: response.data.results,
      });
    } catch (error) {
      setApiData({ status: "rejected", error });
      console.error(error);
    }
  }, []);

  useEffect(() => {
    memoizedCallApi(page);
  }, [memoizedCallApi, page]);

  function setNextPage() {
    setPage(page + 1);
  }

  return [apiData, setNextPage];
}

function App() {
  const [apiData, callNextPage] = useAsync();
  const [apiData2, callNextPage2] = useAsync();

  return (
    <div>
      <div style={{ width: "50%" }}>
        <button
          onClick={() => {
            callNextPage();
          }}
        >
          Get next page
        </button>
        <Users {...apiData} />
      </div>
      <div style={{ width: "50%" }}>
        <button
          onClick={() => {
            callNextPage2();
          }}
        >
          Get next page
        </button>
        <Users {...apiData2} />
      </div>
    </div>
  );
}

export default App;
