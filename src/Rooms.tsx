import React from "react";
import { IRoom } from "./reducers";
import Room from "./Room";

interface RoomsProps {
  rooms: IRoom[];
}

export const Rooms: React.FC<RoomsProps> = ({ rooms }) => {
  return (
    <div>
      {rooms.map((room) => (
        <Room key={room.id} slug={room.id} />
      ))}
    </div>
  );
};
