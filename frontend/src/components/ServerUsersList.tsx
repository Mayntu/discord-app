import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hoock";
import { useParams } from "react-router-dom";
import serveruserImg from "../assets/server-user.png";
import avatar from "../assets/sonic.png";
import {
  fetchPostAddUserRole,
  fetchPostDeleteRole,
  fetchPostGetServersMembers,
} from "../store/acthionServerUser";
import dleteRole from "../assets/deleterole.png";
import { online } from "../store/ServerSlice";

const ServerUsersList: FC = () => {
  const dispatch = useAppDispatch();
  const { serverid } = useParams();
  const usersServer = useAppSelector((state) => state.server.UserInServer);
  const roles = useAppSelector((state) => state.server.ServersRoles);
  const [isRole, setIsRole] = useState<boolean>(false);
  const [user, setUser] = useState<TGetServersUsers>();

  const usersConnect = useAppSelector((state) => state.chats.usersConnect);

  useEffect(() => {
    if (usersConnect.length !== 0) {
      dispatch(online(usersConnect));
    }
  }, [usersConnect, usersServer]);

  useEffect(() => {
    serverid && dispatch(fetchPostGetServersMembers(serverid));
  }, []);

  return (
    <>
      <div className="message-container-server-user">
        <div className="server-users">
          <img src={serveruserImg} alt="" />
          <p>Участники</p>
        </div>
        {usersServer.map((i) => (
          <div
            className="chat-container-server"
            key={i.uuid}
            onClick={() => {
              console.log(i.role.name);
              if (i.role.name !== "owner") {
                setIsRole(!isRole);
                setUser(i);
              }
            }}
          >
            <div className="avatar">
              <img
                src={
                  i?.avatar
                    ? "http://localhost:5173/public/" + i.avatar
                    : avatar
                }
                alt=""
                title={i?.name}
              />
            </div>
            <div className="content-chat" title={i?.name}>
              <p style={{ color: `${i.role.color}` }}>{i?.name}</p>

              {i?.status ? (
                <div className="status"></div>
              ) : (
                <div className="status-red"></div>
              )}
            </div>
          </div>
        ))}

        {isRole && serverid && user && (
          <div className="role-list">
            <p className="tit3">Роль</p>
            {roles.map((i) => (
              <>
                <p
                  key={i.uuid}
                  style={{ color: `${i.color}` }}
                  className="role"
                  onClick={() => {
                    console.log(user);
                    dispatch(
                      fetchPostAddUserRole({
                        server_uuid: serverid,
                        role_uuid: i.uuid,
                        user_uuid_to_add: user.user_uuid,
                      })
                    ).then(() => {
                      dispatch(fetchPostGetServersMembers(serverid));
                    });
                    setIsRole(false);
                  }}
                >
                  {" "}
                  <div
                    className="status"
                    style={{ backgroundColor: `${i.color}` }}
                  />{" "}
                  {i.name}{" "}
                </p>

                <img
              src={dleteRole}
              alt=""
              onClick={() => {
                dispatch(
                  fetchPostDeleteRole({
                    server_uuid: serverid,
                    role_uuid: i.uuid,
                  })
                );
              }}
            />
              </>
            ))}

           
          </div>
        )}
      </div>
    </>
  );
};

export default ServerUsersList;
