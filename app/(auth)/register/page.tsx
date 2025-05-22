import { AuthContainer } from "@/modules/auth";

export default function RegisterScreen() {
  return (
    <>
      <AuthContainer
        type={"register"}
        header={"Create Account"}
        description={"Get started in minutes"}
      />
    </>
  );
}
