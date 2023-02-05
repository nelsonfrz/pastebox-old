import { type GetServerSideProps, type NextPage } from "next";
import { api } from "../../utils/api";
import * as Mantine from '@mantine/core';
import Link from "next/link";
import { getServerAuthSession } from "../../server/auth";

const AllPastesPage: NextPage = () => {
  const getAllQuery = api.paste.getAll.useQuery(); 

  return (<>
    <Mantine.Center>
      <Mantine.Stack w={500}>
        <Mantine.Title>Your Pastes</Mantine.Title>
        <Mantine.Space h='xl' />

        {getAllQuery.isLoading ?
          (<Mantine.Text>Loading...</Mantine.Text>)
        :
          (<Mantine.Stack>
            {getAllQuery.data?.pastes.map(paste => (
              <Link key={paste.id} href={`/paste/${paste.id}`}>
                <Mantine.Card>
                  <Mantine.Title style={{overflow: 'hidden', width: '100%', wordBreak: 'break-all'}} order={4}>{paste.title}</Mantine.Title>
                </Mantine.Card>
              </Link>
            ))}
          </Mantine.Stack>)
        }
        <Mantine.Space h='xl' />
      </Mantine.Stack>
    </Mantine.Center>
  </>)
}

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

export default AllPastesPage;