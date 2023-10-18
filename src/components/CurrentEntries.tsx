import { Container, Spinner } from "@chakra-ui/react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { RAFFLE_CONTRACT_ADDRESS } from "../const/addresses";
import EntryCard from "./EntryCard";

export default function CurrentEntries() {
  const { contract } = useContract(RAFFLE_CONTRACT_ADDRESS);

  const { data: currentEntries, isLoading: isLoadingCurrentEntries } =
    useContractRead(contract, "getPlayer");
  return (
    <Container py={2} style={{ maxWidth: "100%" }}>
      {!isLoadingCurrentEntries ? (
        currentEntries?.map((entry: any, index: number) => (
          <EntryCard key={index} walletAddress={entry} />
        ))
      ) : (
        <Spinner />
      )}
    </Container>
  );
}
