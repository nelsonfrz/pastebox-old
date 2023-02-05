import { Button } from "@mantine/core";
import { signOut } from "next-auth/react";

const SignOutButton: React.FC = () => {
  return (<>
    <Button color='red' onClick={() => void signOut()}>Sign Out</Button>
  </>);
}

export default SignOutButton;