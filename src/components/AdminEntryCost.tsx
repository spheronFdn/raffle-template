import { Box, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { Web3Button, useContract, useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { RAFFLE_CONTRACT_ADDRESS } from "../const/addresses";
import { useState } from "react";

export default function AdminEntryCost() {
  const { contract } = useContract(RAFFLE_CONTRACT_ADDRESS);

  const { data: entryCost, isLoading: isLoadingEntryCost } = useContractRead(
    contract,
    "entryCost"
  );

  const { data: raffleStatus } = useContractRead(contract, "raffleStatus");

  const [entryCostValue, setEntryCostValue] = useState(0);

  function resetEntryCost() {
    setEntryCostValue(0);
  }

  return (
    <Stack spacing={4}>
      <Box>
        <Text fontWeight={"bold"} mb={4} fontSize={"xl"}>
          Ticket Price
        </Text>
        {!isLoadingEntryCost ? (
          <Text fontSize={"xl"}>
            {ethers.utils.formatEther(entryCost)} MATIC
          </Text>
        ) : (
          <Spinner />
        )}
      </Box>
      <Input
        type='number'
        value={entryCostValue}
        onChange={(e) => setEntryCostValue(parseFloat(e.target.value))}
      />
      <Web3Button
        contractAddress={RAFFLE_CONTRACT_ADDRESS}
        action={(contract) =>
          contract.call("changeEntryCost", [
            ethers.utils.parseEther(entryCostValue.toString()),
          ])
        }
        onSuccess={resetEntryCost}
        isDisabled={raffleStatus}
      >
        Update Entry Cost
      </Web3Button>
    </Stack>
  );
}
