import { Card, Text } from "@chakra-ui/react";

type Props = {
  raffleStatus: boolean;
};

export default function RaffleStatus({ raffleStatus }: Props) {
  let backgroundColor = raffleStatus ? "#B0FFBD" : "#faaea8";
  let borderColor = raffleStatus ? "green.500" : "red.500";
  let textColor = raffleStatus ? "#0A0A0A" : "#0A0A0A";
  return (
    <Card
      py={2}
      textAlign={"center"}
      backgroundColor={backgroundColor}
      border={"1px solid"}
      borderColor={borderColor}
    >
      <Text
        fontWeight={"bold"}
        fontFamily='Gilroy-ExtraBold'
        color={textColor}
        fontSize={"sm"}
      >
        Raffle Status: {raffleStatus ? "Open" : "Closed"}
      </Text>
    </Card>
  );
}
