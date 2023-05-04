import { AccessControl } from "accesscontrol";

let grantArray = [
  { role: "admin", resource: "user", action: "read:any", attributes: ["*"] },
];

const ac = new AccessControl(grantArray);

export default ac;
