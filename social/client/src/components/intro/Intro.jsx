import {useNavigate} from 'react-router-dom';

import { Button, Container, Grid } from "@mui/material";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import InfoIcon from '@mui/icons-material/Info';

const Intro = (props) => {
    const navigate = useNavigate();

    let date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    const relationShipMap ={
        1:"Single",
        2:"In Relationship",
        3:"",
    }
    return ( 
        <>
            {props && props.user &&
             <Container>
                <Grid container  columns={12}>
                       <Grid item lg={12} xs={12}>
                           <div className="center">Intro</div> 
                        </Grid>
                       <Grid item lg={12} xs={12}>
                           <div className='m-10 vcenter'>
                               <InfoIcon/><span className="mx-10"> {props.user.description}</span> 
                           </div>
                       </Grid>
                       <Grid item lg={12} xs={12}>
                           <div className='m-10 vcenter'>
                               <HomeRoundedIcon /><span className="mx-10">Lives in {props.user.city}</span> 
                           </div>
                       </Grid>
                       <Grid item lg={12} xs={12}>
                           <div className='m-10 vcenter'>
                                <LocationOnRoundedIcon/><span className="mx-10">From {props.user.from}</span>
                           </div>
                       </Grid>
                        {props.user.relationship!==3 &&
                            <Grid item lg={12} xs={12}>
                                <div className='m-10 vcenter'>
                                    <FavoriteRoundedIcon /><span className="mx-10"> {relationShipMap[props.user.relationship]}</span>
                                </div>
                            </Grid>
                        }
                       <Grid item lg={12} xs={12}>
                           <div className='m-10 vcenter'>
                                <AccessTimeFilledRoundedIcon/><span className="mx-10">Joined on {monthNames[date.getMonth(props.user.createdAt)]}, {date.getFullYear(props.user.createdAt)}</span> 
                           </div>
                       </Grid>
                        {props.selfView && <Grid item lg={12} xs={12}>
                            <div className='center'>
                                <Button onClick={(e)=>{navigate('/editIntro')}}>Edit Intro</Button>
                            </div>
                        </Grid>}
                        
                </Grid>
            </Container>
            }
        </>
     );
}
 
export default Intro;