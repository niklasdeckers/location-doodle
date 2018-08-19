import reducer from "./reducers/index";
import { createStore, applyMiddleware } from "redux";

export default createStore(
  reducer,
);
