import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import {
  MantineProvider,
  AppShell,
  Header,
  Title,
} from '@mantine/core';

import { api } from "../utils/api";
import "../styles/globals.css";
import Link from "next/link";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  return (
    <SessionProvider session={session}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
        <AppShell
          header={
            <Header height={{ base: 50, md: 70 }} p="md">
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Link href='/' style={{textDecoration: 'none'}}>
                  <Title color='#fff' order={3}>Pastebox</Title>
                </Link>
              </div>
            </Header>
          }
        >
          <Component {...pageProps} />
        </AppShell>
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
