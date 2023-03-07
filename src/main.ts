import { ApiServer } from "./apiServer/apiServer";
import { apiPort } from "./common/setting";
const apiServer = new ApiServer();
apiServer.start(apiPort);