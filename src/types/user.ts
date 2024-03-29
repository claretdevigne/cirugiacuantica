export type USER = {
  _id: string,
  name: string,
  email: string,
  password: string,
  admin: boolean,
  current_courses: Array<string>,
  courses_completed: Array<string>
};
