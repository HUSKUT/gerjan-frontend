import {Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import React from "react";
import {useQuery} from "@tanstack/react-query";

interface Restaurant {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    brand: any,
    cuisineTypes: string[],
    id: string,
    indicators: object,
    location: object,
    paymentMethods: string[],
    popularity: number,
    priceRange: number,
    primarySlug: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rating: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shippingInfo: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supports: any,

}

const listRestaurants =
    async (): Promise<object> => {
        console.log(import.meta.env.VITE_BACKEND_URL)
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/listrestaurants' || '');
        const result = await response.json();

        return result.body;
    }

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function toDate(dStr, format) {
    const now = new Date();
    if (format == "h:m") {
        now.setHours(dStr.substr(0, dStr.indexOf(":")));
        now.setMinutes(dStr.substr(dStr.indexOf(":") + 1));
        now.setSeconds(0);
        return now;
    } else {
        return new Date();
    }
}

function RestaurantList() {

    // Queries
    const {isPending, data} = useQuery({queryKey: ['restaurants'], queryFn: listRestaurants})

    if (isPending) return 'Loading...'

    if (data) {
        const restaurants = Object.values(data)
        return (
            <>
                <List sx={{width: '100%', maxWidth: 500, bgcolor: 'background.paper'}}>
                    {
                        restaurants?.map((restaurant: Restaurant) => {

                            if (restaurant.supports.delivery === false && restaurant.shippingInfo.delivery.isOpenForOrder === false) return (<></>)

                            const openingTime = restaurant.shippingInfo.delivery.openingTime ?? 'Open!';
                            const openTimeReal = toDate(openingTime, 'h:m');
                            const timeColor = openTimeReal > new Date() ? 'Red' : 'Green';
                            return (
                                <a href={'https://www.thuisbezorgd.nl/menu/' + restaurant.primarySlug}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar alt="Restaurant"
                                                    sx={{border: 'solid', borderColor: '#fff', borderWidth: '1px'}}
                                                    src={restaurant.brand.logoUrl.replace('{parameters}', 'c_thumb,h_120,w_176/f_auto/q_auto/dpr_1.0')}/>
                                        </ListItemAvatar>
                                        <ListItemText
                                            sx={{ textDecoration: 'none', color: '#fff' }}
                                            primary={<strong> {restaurant.brand.name} </strong>}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{display: 'inline', padding: '1px'}}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        <Typography>Max delivery
                                                            time: {restaurant.shippingInfo.delivery.durationRange.max} minutes</Typography>
                                                        {openingTime !== 'Open!' &&
                                                        <Typography color={timeColor}>Opens
                                                            at: {openingTime}</Typography> }
                                                        {openingTime === 'Open!' &&
                                                        <Typography color={timeColor}>Open!</Typography> }

                                                    </Typography>
                                                </React.Fragment>
                                            }/>
                                    </ListItem>
                                </a>
                            )
                        })
                    }
                </List>
            </>
        )
    }
}

export default RestaurantList;
