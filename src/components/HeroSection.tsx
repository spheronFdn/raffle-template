import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { HERO_IMAGE_URL } from "../const/addresses";
import RaffleStatus from "./RaffleStatus";
import {
  MediaRenderer,
  Web3Button,
  useAddress,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import { RAFFLE_CONTRACT_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { useState } from "react";
import PrizeNFT from "./PrizeNFT";
import CurrentEntries from "./CurrentEntries";

import styles from "./styles.module.css";

export default function HeroSection() {
  const address = useAddress();
  const { contract } = useContract(RAFFLE_CONTRACT_ADDRESS);
  const { data: entryCost, isLoading: isLoadingEntryCost } = useContractRead(
    contract,
    "entryCost"
  );
  const entryCostInEther = entryCost
    ? ethers.utils.formatEther(entryCost)
    : "0";

  const { data: raffleStatus } = useContractRead(contract, "raffleStatus");
  const { data: totalEntries, isLoading: isLoadingTotalEntries } =
    useContractRead(contract, "totalEntries");
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [entryAmount, setEntryAmount] = useState(0);
  const entryCostOnSubmit = parseFloat(entryCostInEther) * entryAmount;

  function increaseEntryAmount() {
    setEntryAmount(entryAmount + 1);
  }

  function decreaseEntryAmount() {
    if (entryAmount > 0) {
      setEntryAmount(entryAmount - 1);
    }
  }

  const handleTransactionSubmit = () => {
    console.log("Transaction submitted");
    setIsLoading(true); // Set loading to true when transaction is submitted
  };

  const handleTransactionSuccess = (result: any) => {
    console.log("Transaction successful");
    // Reset entryAmount to zero here
    setEntryAmount(0);
    setIsLoading(false); // Set loading to false when transaction is successful
  };

  return (
    <Container
      display={{ base: "flex", md: "flex-row" }}
      maxW={{ base: "100%", md: "1440px" }}
      py={8}
      flexDirection={{ base: "column", md: "row" }}
      alignItems={{ base: "center", md: "flex-start" }}
    >
      <SimpleGrid
        style={{ flex: "80%" }}
        minChildWidth={"300px"}
        spacing={10}
        mx='auto'
      >
        <Flex>
          {raffleStatus ? (
            <PrizeNFT />
          ) : (
            <MediaRenderer src={HERO_IMAGE_URL} width='100%' height='100%' />
          )}
        </Flex>
      </SimpleGrid>
      <Flex
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems={"center"}
        p={"1%"}
      >
        <Stack spacing={10}>
          <Box>
            <Badge
              borderRadius='md'
              fontSize='1em'
              px='5'
              h='10'
              py='2'
              colorScheme='blackAlpha'
              bg='black' // Set the background color to black
              color='white' // Set the font color to white
              textTransform='none'
              fontFamily='Gilroy-ExtraBold'
            >
              Raffle App
            </Badge>

            <Text
              fontFamily='Gilroy-ExtraBold'
              fontSize={"4xl"}
              className='gilroy-extra-bold'
            >
              Buy a ticket to win the NFT Prize
            </Text>
          </Box>
          <Text fontSize={"xl"} fontFamily='Gilroy-Regular'>
            Buy entries for a chance to win the NFT! Winner will be selected and
            transferred the NFT. The more entries the higher chance you have of
            winning the prize.
          </Text>
          <RaffleStatus raffleStatus={raffleStatus} />
          {!isLoadingEntryCost && (
            <Text fontFamily='Gilroy-ExtraBold' fontSize={"2xl"}>
              Cost per ticket: {entryCostInEther} MATIC
            </Text>
          )}
          {address ? (
            <Flex flexDirection={"column"}>
              <Flex flexDirection={"row"} w={"25%"} mr={"40px"}>
                <Button onClick={decreaseEntryAmount}>-</Button>
                <Input
                  value={entryAmount}
                  type={"number"}
                  onChange={(e) => setEntryAmount(parseInt(e.target.value))}
                  textAlign={"center"}
                  mx={1}
                  minW={"95px"}
                  padding={{ md: "2px", lg: "5px" }}
                />
                <Button onClick={increaseEntryAmount}>+</Button>
              </Flex>
              <Box mt={7}>
                <Web3Button
                  className={styles.BuyButton}
                  contractAddress={RAFFLE_CONTRACT_ADDRESS}
                  action={(contract) =>
                    contract.call("buyEntry", [entryAmount], {
                      value: ethers.utils.parseEther(
                        entryCostOnSubmit.toString()
                      ),
                    })
                  }
                  onSubmit={handleTransactionSubmit}
                  onSuccess={handleTransactionSuccess}
                  isDisabled={entryAmount === 0 || !raffleStatus}
                >
                  {isLoading ? "Loading..." : "Buy Ticket(s)"}
                </Web3Button>
              </Box>
            </Flex>
          ) : (
            <Text fontSize={"xl"} fontFamily={"Gilroy-Regular"} color='red'>
              Connect wallet to buy entries !
            </Text>
          )}
          {!isLoadingTotalEntries && (
            <Card marginBottom='0.6em'>
              <CardBody
                fontFamily='Gilroy-ExtraBold'
                fontSize='2xl'
                fontWeight={"semibold"}
              >
                Total Entries: {totalEntries.toString()}
              </CardBody>
            </Card>
          )}
        </Stack>
        <Card width='100%'>
          <CardHeader
            style={{
              paddingLeft: "1em",
              paddingRight: "var(--card-padding)",
              paddingBottom: "0.5em",
              paddingTop: "1em",
            }}
          >
            <Heading fontFamily='Gilroy-SemiBold' fontSize='xl'>
              {" "}
              Current raffle Entries:
            </Heading>
          </CardHeader>
          <CurrentEntries />
        </Card>
      </Flex>
    </Container>
  );
}
