import { type NextPage } from "next";
import { useRouter } from 'next/router'
import { api } from "../../../utils/api";
import * as Mantine from '@mantine/core';
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const PastePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: sessionData } = useSession();
  const getPasteQuery = api.paste.get.useQuery({ 
    id: (id ?? '').toString()
  }, {
    enabled: router.isReady
  });
  const getUserDataQuery = api.user.getUserData.useQuery({ 
    id: getPasteQuery.data?.paste?.userId ?? ''
  }, {
    enabled: router.isReady && !!getPasteQuery.data
  });
  const deletePasteMutation = api.paste.delete.useMutation({
    onSuccess: () => {
      void router.push('/');
    }
  });

  return (
  <Mantine.Center>
    <Mantine.Stack w={500}>
      {(!router.isReady || getPasteQuery.isLoading) ?
        <Mantine.Title>Loading...</Mantine.Title>
      :
        getPasteQuery.data?.paste ?
          <>
            {getUserDataQuery.data?.image &&
            <>
              <Mantine.Group>
                <Image style={{ borderRadius: '1000px' }} src={getUserDataQuery.data.image ?? ''} alt='User image' width={35} height={35} />
                <Link href={`/user/${getPasteQuery.data.paste.userId}`}>
                  <Mantine.Title style={{overflow: 'hidden', width: '100%', wordBreak: 'break-all'}} order={3}>{getUserDataQuery.data.name}</Mantine.Title>
                </Link>
              </Mantine.Group>
              <Mantine.Text style={{overflow: 'hidden', width: '100%', wordBreak: 'break-all'}}>{getPasteQuery.data.paste.date.toLocaleString()}</Mantine.Text>
            </>}

            <Mantine.Title style={{overflow: 'hidden', width: '100%', wordBreak: 'break-all'}}>{getPasteQuery.data.paste.title}</Mantine.Title>
            <Mantine.Text style={{overflow: 'hidden', width: '100%', wordBreak: 'break-all'}}>{getPasteQuery.data.paste.content}</Mantine.Text>
            <Mantine.Group>
              <Mantine.ActionIcon onClick={() => {
                void navigator.share({ 
                  title: getPasteQuery.data.paste?.title, 
                  url: `https://pastebox.vercel.app/paste/${getPasteQuery.data.paste?.id ?? ''}`
                });
              }} color='blue' variant='filled'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                  <path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                  <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                  <path d="M8.7 10.7l6.6 -3.4"></path>
                  <path d="M8.7 13.3l6.6 3.4"></path>
                </svg>
                </Mantine.ActionIcon>
              <Mantine.ActionIcon onClick={() => {
                void navigator.clipboard.writeText(getPasteQuery.data.paste?.content ?? '');
              }} color='teal' variant='filled'>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                  <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                </svg>
              </Mantine.ActionIcon>
              {sessionData?.user.id == getPasteQuery.data.paste.userId &&
              <>
                <Mantine.ActionIcon onClick={() => {
                  void router.push(`/paste/${getPasteQuery.data.paste?.id ?? ''}/edit`)
                }} variant='filled'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                    <path d="M13.5 6.5l4 4"></path>
                  </svg>
                </Mantine.ActionIcon>
                <Mantine.ActionIcon onClick={() => {
                  deletePasteMutation.mutate({
                    id: getPasteQuery.data.paste?.id ?? ''
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
              </>
              }
            </Mantine.Group>
          </>
        :
        <Mantine.Title>Post not found.</Mantine.Title>
      }
    </Mantine.Stack>
  </Mantine.Center>);
}

export default PastePage;