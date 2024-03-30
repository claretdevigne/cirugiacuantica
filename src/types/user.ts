export type USER = {
  name: string,
  email: string,
  password: string,
  admin: boolean,
  current_courses: Array<string>,
  courses_completed: Array<string>
};
