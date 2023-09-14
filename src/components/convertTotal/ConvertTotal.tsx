import {TotalDto} from "../../types/dto/totalDto";
import {Title, Text, Paper, Image, Flex, Box} from "@mantine/core";
import {CurrencyDto} from "../../types/dto/currencyDto";


interface IProps {
    total: TotalDto
    fromCurrency: CurrencyDto
    amount: number
}

export function ConvertTotal({total, fromCurrency, amount}: IProps) {
    return (

        <Paper shadow="xs" p="lg" mb={20}>
            <Flex w={"100%"} justify="space-between">
                <Box>
                    <Text c="#718093" fw={700}>{amount} {fromCurrency.label} =</Text>
                    <Title order={1} c="#2f3640" my={5}>{total.sum} {total.currency}</Title>
                    <Text c="#718093" fw={700}>1{fromCurrency.label} = {total.sum / amount} {total.currency}</Text>
                </Box>


                <Image src={total.country} width={150} height={"100%"} radius={10}/>


            </Flex>

        </Paper>


    );
}