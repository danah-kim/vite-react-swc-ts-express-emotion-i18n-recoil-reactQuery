import styled from '@emotion/styled';
import { usePageContext } from 'hooks/usePageContext';
import { type ReactNode } from 'react';

export { Link };

function Link(props: { href?: string; className?: string; children: ReactNode }) {
  const pageContext = usePageContext();
  const className = [props.className, pageContext.urlPathname === props.href && 'is-active'].filter(Boolean).join(' ');

  return <Navitem {...props} className={className} />;
}

const Navitem = styled.a`
  padding: 3px 10px;
  .is-active {
    background-color: #eee;
  }
`;
