import { Box, Card, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import {
  ThirdwebNftMedia,
  useContract,
  useContractMetadata,
  useContractRead,
  useNFT,
} from "@thirdweb-dev/react";
import { RAFFLE_CONTRACT_ADDRESS } from "../const/addresses";

import styles from "./styles.module.css";

export default function PrizeNFT() {
  const { contract: raffleContract } = useContract(RAFFLE_CONTRACT_ADDRESS);

  const { data: prizeNFTContractAddress } = useContractRead(
    raffleContract,
    "nftAddress"
  );
  const { data: prizeNFTTokenId } = useContractRead(raffleContract, "nftId");

  const { contract: prizeNFTContract } = useContract(prizeNFTContractAddress);

  const {
    data: prizeNFTContractMetadata,
    isLoading: isLoadingPrizeNFTContractMetadata,
  } = useContractMetadata(prizeNFTContract);

  const { data: nft, isLoading: isLoadingNFT } = useNFT(
    prizeNFTContract,
    prizeNFTTokenId
  );

  return (
    <Card p={"3%"} style={{ marginBottom: "5em" }}>
      <Heading
        fontFamily='Gilroy-ExtraBold'
        style={{ marginBottom: "0.314159em" }}
      >
        Prize NFT
      </Heading>
      {!isLoadingPrizeNFTContractMetadata && !isLoadingNFT ? (
        <Stack spacing={"20px"} textAlign={"center"}>
          <Box bg='#F8F8F8' p={3} borderRadius='2xl'>
            <ThirdwebNftMedia
              metadata={nft?.metadata!}
              height='488px'
              width='488px'
              className={styles.NFT}
            />
          </Box>
          <Box>
            <Text
              fontFamily='Gilroy-ExtraBold'
              fontSize={"xl"}
              fontWeight={"bold"}
            >
              {prizeNFTContractMetadata?.name}
            </Text>
            <Text fontFamily='Gilroy-ExtraBold' fontWeight={"normal"}>
              {nft?.metadata.name}
            </Text>
          </Box>
        </Stack>
      ) : (
        <Spinner />
      )}
    </Card>
  );
}
