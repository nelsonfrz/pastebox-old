import { type NextPage } from "next";
import { getServerAuthSession } from "../server/auth";
import { type Provider } from "next-auth/providers";
import type { GetServerSideProps } from "next";
import * as Mantine from '@mantine/core';
import { getProviders, signIn } from "next-auth/react";

interface SignInProps { 
  providers: Provider[]; 
} 

const SignIn: NextPage<SignInProps> = ({ providers }) => {
  return (<>
    <Mantine.Center>
      <Mantine.Stack w={500}>
        <Mantine.Title>Please sign in.</Mantine.Title>
        <Mantine.Text>To use Pastebox you need to authenticate yourself.</Mantine.Text>
        {Object.values(providers).map((provider) => (
          <Mantine.Button color='gray' key={provider.id} onClick={() => void signIn(provider.id)}>Sign in with {provider.name}</Mantine.Button>
        ))}
      </Mantine.Stack>
    </Mantine.Center>
  </>)
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const providers = await getProviders();

  return {
    props: {
      providers: Object.values(providers ?? {}) ?? []
    },
  };
};

export default SignIn;