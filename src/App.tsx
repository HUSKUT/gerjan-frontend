import './App.css'
import RestaurantList from "./components/RestaurantList/RestaurantList.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const queryClient = new QueryClient()

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline/>
                <QueryClientProvider client={queryClient}>
                    <div style={{ fontSize: '220%', fontWeight: 'bold' }}>bestellenbijgerjan.nl</div>
                    <RestaurantList/>
                </QueryClientProvider>
            </ThemeProvider>
        </>
    )
}

export default App
