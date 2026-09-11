import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "./app/features/authSlice";
import Mainroutes from "./routes/Mainroutes";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return <Mainroutes />;
}

export default App;