import { type NextPage } from "next";
import { useRouter } from 'next/router'
import { api } from "../../utils/api";
import * as Mantine from '@mantine/core';
import Image from "next/image";
import Link from "next/link";

const UserPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const getUserDataQuery = api.user.getUserData.useQuery({ 
    id: (id ?? '').toString()
  }, {
    enabled: router.isReady
  });
  const getUserPastesQuery = api.user.getUserPastes.useQuery({ 
    id: (id ?? '').toString()
  }, {
    enabled: router.isReady
  });

  return (<Mantine.Center>
    <Mantine.Stack w={500}>
      {(!router.isReady || getUserDataQuery.isLoading) ?
          <Mantine.Title>Loading...</Mantine.Title>
        :
          getUserDataQuery.data ?
          <>
            <Mantine.Group>
              <Image style={{ borderRadius: '1000px' }} src={getUserDataQuery.data.image ?? ''} alt='User image' width={60} height={60} />
              <Mantine.Title style={{overflow: 'hidden', wordBreak: 'break-all'}}>{getUserDataQuery.data.name}</Mantine.Title>
            </Mantine.Group>
            <Mantine.Title order={2}>Pastes</Mantine.Title>
            <Mantine.Stack>
              {getUserPastesQuery.data?.pastes.map(paste => 
                <Link key={paste.id} href={`/paste/${paste.id}`}>
                  <Mantine.Card>
                    <Mantine.Title style={{overflow: 'hidden', width: '100%', wordBreak: 'break-all'}} order={4}>{paste.title}</Mantine.Title>
                  </Mantine.Card>
                </Link>
              )}
            </Mantine.Stack>
          </>
          :
          <Mantine.Title>User not found.</Mantine.Title>
      }
    </Mantine.Stack>
  </Mantine.Center>)
}

export default UserPage;