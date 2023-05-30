import { ChangeRole } from './change-role.type';
import { UploadAvatar } from './upload-avatar.type';

export type UserData = {
  data: ChangeRole | UploadAvatar;
};
