import { AuthContainer } from "@/modules/auth";

export default function LoginScreen() {
  return (
    <AuthContainer
      type={"login"}
      header={"Welcome Back"}
      description={" Sign in with email and password"}
    />
  );
}
