import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  { path: "chat", file: "routes/chat.tsx" }
] satisfies RouteConfig;
