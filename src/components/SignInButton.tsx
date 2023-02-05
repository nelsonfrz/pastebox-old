import { Button } from "@mantine/core";
import { signIn } from "next-auth/react";

const SignInButton: React.FC = () => {
  return (<>
    <Button w={150} onClick={() => void signIn()}>Sign In</Button>
  </>);
}

export default SignInButton;