import {Autocomplete, Box, Button, TextField} from "@mui/material";
import {CURRENCIES_DATA} from "../../__data__";
import {useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {apis} from "../../helpers/apis/apis";



export function MainPage(props) {

    const [data, setData] = useState(CURRENCIES_DATA);

    const [currency, setCurrency] = useState([]);

    const [total, setTotal] = useState([]);

    const test  = (e: any, values) => {
        setCurrency(prev => [...prev, values])
    }


    const onBlur = (e) => {


        var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/currency";
        var token = "ef558fb92da0f88f2902a64a13a40766d0bf28f0";
        var query = "все";

        var options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify({query: query})
        }

        fetch(url, options as any)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log("error", error));

        // setTotal([])
        //
        // const symbolsArr = currency.map((el,index) => {
        //
        //     if(index !== 0) {
        //         return el.label
        //     }
        //     else {
        //         return
        //     }
        //
        // })
        //
        // const symbols = symbolsArr.join().replace(/,/, '%2C%20')
        //
        // console.log(symbols)
        //
        // axios.get(apis.latest, {
        //     headers: {
        //         "apikey": "riAe6q6igEyZQkDFkw68VXMlEoPhHQXT"
        //     },
        //     params: {
        //         symbols,
        //         base: currency[0].label
        //     }
        // }).then(response => {
        //
        //
        //
        //     for(const  key in response.data.rates) {
        //
        //         const total = e.target.value * response.data.rates[key]
        //
        //
        //         setTotal(prev => [prev,  total])
        //
        //
        //     }
        // })


    }


    return (
        <Box sx={{ flexDirection: 'row' }}>

            <TextField fullWidth label="fullWidth" id="fullWidth" onBlur={onBlur}/>

            <Autocomplete
                onChange={test}
                id="combo-box-demo"
                options={data}
                value={currency[0]}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="from" />}
            />
            <Button variant="contained">reverse</Button>

            <Autocomplete
                onChange={test}
                id="combo-box-demo"
                options={data}
                value={currency[1]}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="to" />}
            />


            {total.map(el => <h1>{el}</h1>)}

        </Box>
    );
}

