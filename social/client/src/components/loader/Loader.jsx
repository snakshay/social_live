import Backdrop from '@mui/material/Backdrop';
import HashLoader from "react-spinners/HashLoader";
import  { css } from "styled-components";


const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
const Loader = (props) => {

    return (
      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={props.loading}
        >

        <HashLoader css={override} size={100} color='yellow' loading={props.loading} speedMultiplier={1.5} />
      </Backdrop>
      
      );
}
 
export default Loader;