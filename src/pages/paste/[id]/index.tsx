import { type NextPage } from "next";
import { useRouter } from 'next/router'
import { api } from "../../../utils/api";
import * as Mantine from '@mantine/core';
import { useSession } from "next-auth/react";

const PastePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: sessionData } = useSession();
  const getQuery = api.paste.get.useQuery({ 
    id: (id ?? '').toString()
  }, {
    enabled: router.isReady
  });
  const deleteMutation = api.paste.delete.useMutation({
    onSuccess: () => {
      void router.push('/');
    }
  });

  return (<>
  <Mantine.Center>
    <Mantine.Stack w={500}>
      {(!router.isReady || getQuery.isLoading) ?
        <Mantine.Title>Loading...</Mantine.Title>
      :
        getQuery.data?.paste ?
          <>
            <Mantine.Title style={{overflow: 'hidden', width: '100%', wordBreak: 'break-all'}}>{getQuery.data.paste.title}</Mantine.Title>
            <Mantine.Text style={{overflow: 'hidden', width: '100%', wordBreak: 'break-all'}}>{getQuery.data.paste.content}</Mantine.Text>
            {sessionData?.user.id == getQuery.data.paste.userId &&
            <Mantine.Group>
              <Mantine.ActionIcon onClick={() => {
                void router.push(`/paste/${getQuery.data.paste?.id ?? ''}/edit`)
              }} variant='filled'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                  <path d="M13.5 6.5l4 4"></path>
                </svg>
              </Mantine.ActionIcon>
              <Mantine.ActionIcon onClick={() => {
                deleteMutation.mutate({
                  id: getQuery.data.paste?.id ?? ''
                })
              }} variant='filled' color='red'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M4 7l16 0"></path>
                  <path d="M10 11l0 6"></path>
                  <path d="M14 11l0 6"></path>
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                </svg>
              </Mantine.ActionIcon>
            </Mantine.Group>
            }
          </>
        :
        <Mantine.Title>Post not found.</Mantine.Title>
      }
    </Mantine.Stack>
  </Mantine.Center>
  </>)
}

export default PastePage;