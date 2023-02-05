import { type NextPage } from "next";
import { useRouter } from 'next/router'
import { api } from "../../../utils/api";
import * as Mantine from '@mantine/core';
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";

const EditPastePage: NextPage = () => {
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
  const editMutation = api.paste.edit.useMutation();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [titleError, setTitleError] = useState<string>('');
  const [contentError, setContentError] = useState<string>('');
  const [title, setTitle] = useState<string>(getQuery.data?.paste?.title ?? '');
  const [content, setContent] = useState<string>(getQuery.data?.paste?.content ?? '');

  if (sessionData?.user.id !== getQuery.data?.paste?.userId) {
    void router.push(`/paste/${getQuery.data?.paste?.id ?? ''}`);
  }

  return (<>
  <Mantine.Center>
    <Mantine.Stack w={500}>
      {(!router.isReady || getQuery.isLoading) ?
        <Mantine.Title>Loading...</Mantine.Title>
      :
        getQuery.data?.paste ?
          <>
            <Mantine.Title order={2}>Edit Paste</Mantine.Title>
            <Mantine.TextInput 
              ref={titleRef}
              label='Title'
              placeholder='Title'
              value={title}
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
              value={content}
              onChange={e => {
                setContent(e.currentTarget.value);
                setContentError("");
              }}
              error={contentError}
            />
            {sessionData?.user.id == getQuery.data.paste.userId &&
            <Mantine.Group position='apart'>
              <Mantine.Button
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
                    void editMutation.mutateAsync({
                      id: getQuery.data.paste?.id ?? '',
                      title,
                      content,
                    }).then(paste => {
                      void router.push(`/paste/${paste.id}`);
                    });
                  }
                }}
              >Save</Mantine.Button>
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

export default EditPastePage;
