import { type NextPage } from "next";
import * as Mantine from '@mantine/core';

const PageNotFound: NextPage = () => {
  return (<Mantine.Center>
    <Mantine.Title>404 - Page not found.</Mantine.Title>
  </Mantine.Center>);
}
export default PageNotFound;