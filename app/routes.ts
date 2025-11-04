import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("chat", "routes/chat.tsx"),
  route("pdf", "routes/pdf.tsx"),
  route("threads", "routes/threads.tsx"),
] satisfies RouteConfig;
