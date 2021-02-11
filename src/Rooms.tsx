import React from "react";
import { Button } from "./Components";
import { IRoom } from "./reducers";
import Room from "./Room";

interface RoomsProps {
  rooms: IRoom[];
  removeRoom: (id: string) => void;
}

export const Rooms: React.FC<RoomsProps> = ({ rooms, removeRoom }) => {
  return (
    <div>
      {rooms.map((room) => (
        <div key={room.id}>
          <Button type="button" onClick={() => removeRoom(room.id)}>
            Remove Room
          </Button>
          <Room slug={room.id} />
        </div>
      ))}
    </div>
  );
};
