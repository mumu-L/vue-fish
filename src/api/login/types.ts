export interface UserLoginType {
  username: string
  password: string
}
export type UserResponse = {
  access_token: string
  user: Exclude<UserType, { password: string }>
}
export type UserInfo = UserLoginType & UserType & Pick<UserResponse, 'access_token'>
export interface UserType extends UserLoginType {
  role?: string
  roleId?: string
}
