import React, {useState} from 'react';
import {Box, createStyles, Group, Menu, rem, UnstyledButton, Image} from "@mantine/core";
import {IconChevronDown} from "@tabler/icons-react";
import {useAppSelector} from "../../ducks/hooks";
import {CurrencyDto} from "../../types/dto/currencyDto";

const useStyles = createStyles((theme, {opened}: { opened: boolean }) => ({
    control: {
        width: "100%",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        borderRadius: theme.radius.md,
        border: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]
        }`,
        transition: 'background-color 150ms ease',
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.colors.dark[opened ? 5 : 6]
                : opened
                    ? theme.colors.gray[0]
                    : theme.white,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },

    label: {
        fontWeight: 500,
        fontSize: theme.fontSizes.sm,
    },

    icon: {
        transition: 'transform 150ms ease',
        transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
    },
}));


interface IProps {
    label: string
    name: string
    index?: number,
    country: string
    changeCurrency: (item: CurrencyDto, index?: number) => void
}

export function ConvertSelect({name, changeCurrency, label, index, country}: IProps) {

    const [opened, setOpened] = useState(false);
    const {classes} = useStyles({opened});

    const {allCurrencies} = useAppSelector(store => store.converter)


    return (
        <Box w={"100%"} mb={20}>
            <Menu
                radius="md"
                width="target"
                withinPortal

                position="bottom-start"
            >
                <Menu.Target>
                    <UnstyledButton className={classes.control}>
                        <Group spacing="xs">
                            <Image src={country} width={22}  />
                            <span className={classes.label}>{label}-{name}</span>
                        </Group>
                        <IconChevronDown size="1rem" className={classes.icon} stroke={1.5}/>
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    {
                        allCurrencies.map((item) => (
                            <Menu.Item
                                icon={<Image src={item.country} width={18}/>}
                                onClick={() => changeCurrency(item, index)}
                                key={item.label}
                            >
                                {item.label}
                            </Menu.Item>
                        ))}
                </Menu.Dropdown>
            </Menu>

        </Box>

    );
}