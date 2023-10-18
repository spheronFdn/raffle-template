import { Container, Flex, Heading, Card, Divider } from "@chakra-ui/react";
import AdminRaffleStatus from "../components/AdminRaffleStatus";
import AdminEntryCost from "../components/AdminEntryCost";
import WithdrawBalance from "../components/WithdrawBalance";
import AdminRaffleWinnerCard from "../components/AdminRaffleWinner";

export default function Admin() {
  return (
    <Container maxW={"1440px"} py={8}>
      <Heading>Admin Dashboard</Heading>
      <Flex flexDirection={"row"}>
        <AdminRaffleStatus />
        <Card p={4} mt={4} mr={10} w={"25%"}>
          <AdminEntryCost />
          <Divider mt={4} />
          <WithdrawBalance />
        </Card>
        <AdminRaffleWinnerCard />
      </Flex>
    </Container>
  );
}
