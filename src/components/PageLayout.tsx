import { Global } from '@emotion/react';
import styled from '@emotion/styled';
import { Logo } from 'components';
import { globalStyles } from 'libs/globalStyles';
import type { FC, PropsWithChildren } from 'react';
import { StrictMode } from 'react';

import { Link } from './Link';

const PageLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <StrictMode>
      <Global styles={globalStyles} />
      <Layout>
        <Sidebar>
          <Logo />
          <Link className="navitem" href="/">
            Home
          </Link>
          <Link className="navitem" href="/about">
            About
          </Link>
        </Sidebar>
        <Content>{children}</Content>
      </Layout>
    </StrictMode>
  );
};

const Layout = styled.div`
  display: flex;
  max-width: 900px;
  margin: auto;
`;

const Sidebar = styled.div`
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.8em;
`;

const Content = styled.div`
  padding: 20px 20px 50px;
  border-left: 2px solid #eee;
  min-height: 100vh;
`;

export default PageLayout;
