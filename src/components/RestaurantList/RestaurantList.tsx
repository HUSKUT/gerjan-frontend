import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  MenuItem,
  TextField
} from "@mui/material";
import React, { useState, useMemo } from "react";
import {useQuery} from "@tanstack/react-query";

interface Restaurant {
  brand: any,
  cuisineTypes: string[],
  id: string,
  indicators: object,
  location: object,
  paymentMethods: string[],
  popularity: number,
  priceRange: number,
  primarySlug: string,
  rating: any,
  shippingInfo: any,
  supports: any,

}

const listRestaurants =
  async (): Promise<object> => {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/listrestaurants' || '');
    const result = await response.json();

    return result.body && Object.values(result.body);
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
  const [sort, setSort] = useState<any>('none');
  // Queries
  const {isPending, data: restaurants} = useQuery({queryKey: ['restaurants'], queryFn: listRestaurants});

  // @ts-expect-error
  const filteredRestaurants = useMemo(() => (restaurants || []).filter((restaurant) => restaurant.supports.delivery || restaurant.shippingInfo.delivery), [restaurants]);
  const sortedRestaurants = useMemo(() => (
    filteredRestaurants
      .sort((a: { brand: { name: number; }; shippingInfo: { delivery: { openingTime: any; }; }; }, b: { brand: { name: number; }; shippingInfo: { delivery: { openingTime: any; }; }; }) => {
        switch (sort) {
          case 'name':
            return a.brand.name < b.brand.name
              ? -1
              : 1;
          case 'opening_time':
            const aDeliveryTime = a.shippingInfo.delivery.openingTime;
            const bDeliveryTime = b.shippingInfo.delivery.openingTime;
            if (aDeliveryTime === null && bDeliveryTime !== null) return -1;
            if (bDeliveryTime === null && aDeliveryTime !== null) return 1;
            if (aDeliveryTime === bDeliveryTime) return 0;
            if (aDeliveryTime < bDeliveryTime) return -1;
            if (bDeliveryTime < aDeliveryTime) return 1;
            return 0;
          default:
            return 0;
        }
      })
    ),
    [filteredRestaurants, sort],
  );

  if (isPending) {
    return (
      <>
        Loading...
      </>
    );
  }
  return (
    <>
      <TextField
        onChange={(e) => setSort(e.target.value)}
        select
        value={sort}
        label="Sorteer"
      >
        <MenuItem value="none" disabled={true}>Sorteer</MenuItem>
        <MenuItem value="name">Naam</MenuItem>
        <MenuItem value="opening_time">Openingstijd</MenuItem>
      </TextField>
      <List sx={{width: '100%', maxWidth: 500, bgcolor: 'background.paper'}}>
        {
          sortedRestaurants.map((restaurant: Restaurant) => {
            const openingTime = restaurant.shippingInfo.delivery.openingTime ?? 'Open!';
            const openTimeReal = toDate(openingTime, 'h:m');
            const timeColor = openTimeReal > new Date() ? 'Red' : 'Green';
            return (
              <a href={'https://www.thuisbezorgd.nl/menu/' + restaurant.primarySlug}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt="Restaurant"
                      sx={{border: 'solid', borderColor: '#fff', borderWidth: '1px'}}
                      src={restaurant.brand.logoUrl.replace('{parameters}', 'c_thumb,h_120,w_176/f_auto/q_auto/dpr_1.0')}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ textDecoration: 'none', color: '#fff' }}
                    primary={<strong>{restaurant.brand.name}</strong>}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{display: 'inline', padding: '1px'}}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          <Typography>
                            Max delivery time: {restaurant.shippingInfo.delivery.durationRange.max} minutes
                          </Typography>
                          {openingTime !== 'Open!' && (
                            <Typography color={timeColor}>
                              Opens at: {openingTime}
                            </Typography>
                          )}
                          {openingTime === 'Open!' && (
                            <Typography color={timeColor}>
                              Open!
                            </Typography>
                          )}
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

export default RestaurantList;
