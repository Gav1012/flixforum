import React, { useRef, useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from "@mui/material/Button";
import { CardActionArea, CardContent, CardMedia } from "@mui/material";
import "./ShowCard.css";

// MAJORITY OF CODE COMES FROM THIS VIDEO FOR DISPLAYING THE SHOWS
// https://www.youtube.com/watch?v=FzWG8jiw4XM&ab_channel=LamaDev
function ShowCard() {
    const [list, setList] = useState([]);
    // handles how far you scroll through list of shows
    const [listPos, setListPos] = useState(0);
    // handles updating the position of the shows cards
    const showRef = useRef();
    // function processes click on left and right buttons
    const handleClick = (direction) => {
        // holds the distance to travel between each show card when
        // button is clicked
        let distance = showRef.current.getBoundingClientRect().x - 50;
        if (direction == "left" && listPos > 0) {
            setListPos(listPos - 1);
            showRef.current.style.transform = `translateX(${230 + distance}px)`
        }
        if (direction == "right" && listPos < 5) {
            setListPos(listPos + 1);
            showRef.current.style.transform = `translateX(${-230 + distance}px)`
        }
    }
    fetch('https://netflix-data.p.rapidapi.com/search/?query=&limit_titles=8&limit_suggestions=1', {
      "method": "GET",
      "headers": {
        'X-RapidAPI-Key': '2c0524d1f3msha9fb62d0bf2cad7p11368bjsn299a80d5fc29',
        'X-RapidAPI-Host': 'netflix-data.p.rapidapi.com'
      }
    })
    .then(response => response.json())
    .then((json) => {
        const convert_list = json.titles;
        setList(convert_list);
    })
    .catch(err => {
      console.log(err);
    })
    return(
        <div className="list">
            <div className="recommend"> RECOMMENDED SHOWS</div>
            <div className="wrapper">
                <Button 
                    variant="contained"
                    onClick={()=>handleClick("left")}
                >
                Left
                </Button>
                <div className="container" ref={showRef}>
                    {list.map((show) => (
                        <Card sx={{width: 225, height: 160, ml: 1}}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    image={show.jawSummary.backgroundImage.url}
                                    height='110'
                                    alt="show image"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="subtitle1">
                                        {show.jawSummary.title}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </div>
                <Button 
                    variant="contained"
                    onClick={()=>handleClick("right")}
                >
                Right
                </Button>
            </div>
        </div>
        // <Grid container spacing={3}>
        //     <Grid container item spacing={2}>
        //     {list.map((show) => (
        //         <Grid item sx={{ml: 1}} key={show.jawSummary.id}>
        //             <Card sx={{maxWidth: 345}}>
        //                 <CardActionArea>
        //                     <CardMedia
        //                         component="img"
        //                         height="140"
        //                         image={show.jawSummary.backgroundImage.url}
        //                         alt="show image"
        //                     />
        //                     <CardContent>
        //                         <Typography gutterBottom variant="subtitle1">
        //                             {show.jawSummary.title}
        //                         </Typography>
        //                     </CardContent>
        //                 </CardActionArea>
        //             </Card>
        //         </Grid>
        //     ))}
        //     </Grid>
        // </Grid>
    );
}

export default ShowCard;