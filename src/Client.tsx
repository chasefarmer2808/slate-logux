import styled from "@emotion/styled";
import React, { useMemo, useState } from "react";
import { createEditor, Node } from "slate";
import { withReact } from "slate-react";
import { Button, H4, Instance, Title } from "./Components";

interface ClientProps {
  name: string;
  id: string;
  slug: string;
  removeUser: (id: any) => void;
}

const Client: React.FC<ClientProps> = ({ id, name, slug, removeUser }) => {
  const [value, setValue] = useState<Node[]>([]);
  const [isOnline, setOnlineState] = useState<boolean>(false);

  const editor = useMemo(() => withReact(createEditor()), []);

  const toggleOnline = () => {};

  return (
    <Instance online={isOnline}>
      <Title>
        <Head>Editor: {name}</Head>
        <div style={{ display: "flex", marginTop: 10, marginBottom: 10 }}>
          <Button type="button" onClick={toggleOnline}>
            Go {isOnline ? "offline" : "online"}
          </Button>
          <Button type="button" onClick={() => removeUser(id)}>
            Remove
          </Button>
        </div>
      </Title>
    </Instance>
  );
};

export default Client;

const Head = styled(H4)`
  margin-right: auto;
`;
