import {Flex, Loader} from '@mantine/core';

export function Loading() {
    return (
        <Flex w={"100%"} justify="center" py={50}>
            <Loader/>
        </Flex>
    );
}