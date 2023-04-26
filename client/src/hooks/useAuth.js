import jwtDecode from "jwt-decode"
import { useSelector } from "react-redux"
import { selectCurrentToken } from "../Features/auth/authSlice";

const useAuth = () => {
 const token = useSelector(selectCurrentToken);
  if(token){
    const data = jwtDecode(token);
    const {username, id} = data.UserInfo;
    return {username, id}
  }
 return {username : "", id : ""}
}
export default useAuth; 