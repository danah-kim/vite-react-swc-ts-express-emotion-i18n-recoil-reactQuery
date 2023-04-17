import styled from '@emotion/styled';

export { Page };

function Page() {
  return (
    <>
      <h1>About</h1>
      <p>
        Example of using <Code>vite-plugin-ssr</Code>.
      </p>
    </>
  );
}

const Code = styled.code`
  font-family: monospace;
  background-color: #eaeaea;
  padding: 3px 5px;
  border-radius: 4px;
`;
