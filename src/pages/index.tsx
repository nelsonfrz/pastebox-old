import Head from "next/head";
import { useSession } from "next-auth/react";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerAuthSession } from "../server/auth";
import * as Mantine from '@mantine/core';
import SignOutButton from "../components/SignOutButton";
import { api } from "../utils/api";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [titleError, setTitleError] = useState<string>('');
  const [contentError, setContentError] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const createMutation = api.paste.create.useMutation();

  return (
    <>
      <Head>
        <title>Pastebox</title>
        <meta name="description" content="Paste and share!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Mantine.Center>
        <Mantine.Stack w={500}>
          <Mantine.Title>Welcome {sessionData?.user.name}!</Mantine.Title>

          <Mantine.Title order={2}>Create Paste</Mantine.Title>
          <Mantine.TextInput 
            ref={titleRef}
            label='Title'
            placeholder='Title'
            onChange={e => {
              setTitle(e.currentTarget.value);
              setTitleError("");
            }}
            error={titleError}
            />
          <Mantine.Textarea
            ref={contentRef}
            label='Content'
            placeholder='Content'
            minRows={5}
            autosize
            onChange={e => {
              setContent(e.currentTarget.value);
              setContentError("");
            }}
            error={contentError}
            />

          <Mantine.Flex 
            gap="xl"
            justify="center"
            align="center"
            wrap='wrap'
          >
            <Mantine.Button 
              color='green'
              onClick={() => {
                if (title.trim().length < 1) {
                  setTitleError('Please enter title for paste.');
                }
                if (title.trim().length > 100) {
                  setTitleError('Title is too long. 100 characters max.');
                }
                if (content.length < 1) {
                  setContentError('Please enter content for paste.');
                }
                if (title.trim().length >= 1 && title.trim().length <= 100 && content.length >= 1) {
                  void createMutation.mutateAsync({
                    title,
                    content
                  }).then(paste => {
                    void router.push(`/paste/${paste.id}`);
                  });
                }
              }}
            >Create Paste</Mantine.Button>

            <Link href={`/user/${sessionData?.user.id ?? ''}`}>
              <Mantine.Button>See Your Pastes</Mantine.Button>
            </Link>  
              
            <SignOutButton />
          </Mantine.Flex>
        </Mantine.Stack>
      </Mantine.Center>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      }
    }
  }

  return {
    props: {},
  };
};

export default Home;