type User = {
  _id: string;
  userName: string;
  email: string;
  role: "user" | "admin";
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
};
