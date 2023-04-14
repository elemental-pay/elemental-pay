import { UserType } from "../models";

// export interface Viewer extends UserType {
//   uuid?: string;
//   isPublic?: boolean,
//   isSystem?: boolean,
//   isAuthenticating?: boolean,
// };
export interface Viewer {
  isAuthenticated: boolean;
  id: string;
  username: string;
  roles: string[];
  permissions: string[];
}
