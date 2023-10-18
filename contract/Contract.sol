// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract NFTRaffle {
    address public owner;
    mapping(address => uint256) public entryCount;
    address[] public players;
    address[] private playerSelector; //will be using this only in the contract
    bool public raffleStatus;
    uint256 public entryCost;
    address public nftAddress;
    uint256 public nftId;
    uint256 public totalEntries;

    event NewEntry(address player);
    event RaffleStarted();
    event RaffleEnded();
    event WinnerSelected(address winner);
    event EntryCostChanged(uint256 newCost);
    event NFTPrizeSet(address nftAddress, uint256 nftId);
    event BalanceWithdrawn(uint256 amount);

    constructor(uint256 _entryCost) {
        owner = msg.sender;
        entryCost = _entryCost;
        raffleStatus = false;
        totalEntries = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this contract");
        _;
    }

    function raffleStarted(
        address _nftAddress,
        uint256 _nftId
    ) external onlyOwner {
        require(!raffleStatus, "Raffle is already started");
        require(
            nftAddress == address(0),
            "NFT prize is already set. Please select the winner"
        );
        require(
            ERC721Base(_nftAddress).ownerOf(_nftId) == owner,
            "Owner does not own the NFT"
        );

        nftAddress = _nftAddress;
        nftId = _nftId;
        raffleStatus = true;
        emit RaffleStarted();
        emit NFTPrizeSet(_nftAddress, _nftId);
    }

    function isPlayer(address _player) public returns (bool) {
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == _player) {
                return true;
            }
        }
        return false;
    }

    function buyEntry(uint256 _numberOfEntries) public payable {
        require(raffleStatus, "Raffle has not started");
        require(
            msg.value == entryCost * _numberOfEntries,
            "Incorrect amount sent"
        );

        entryCount[msg.sender] += _numberOfEntries;
        totalEntries += _numberOfEntries;

        if (!isPlayer(msg.sender)) {
            players.push(msg.sender);
        }

        for (uint256 i = 0; i < _numberOfEntries; i++) {
            playerSelector.push(msg.sender);
        }

        emit NewEntry(msg.sender);
    }

    function endRaffle() external onlyOwner {
        require(raffleStatus, "Raffle is not started");
        raffleStatus = false;
        emit RaffleEnded();
    }

    function selectWinner() external onlyOwner {
        require(!raffleStatus, "Raffle is still running");
        require(playerSelector.length > 0, "No Player in the raffle");
        require(nftAddress != address(0), "NFT Prize not set");

        uint256 winnerIndex = random() % playerSelector.length;
        address winner = playerSelector[winnerIndex];
        emit WinnerSelected(winner);

        ERC721Base(nftAddress).transferFrom(owner, winner, nftId);

        resetEntryCount();
        delete players;
        delete playerSelector;
        nftAddress = address(0);
        nftId = 0;
        totalEntries = 0;
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        block.timestamp,
                        players.length
                    )
                )
            );
    }

    function resetEntryCount() private {
        for (uint256 i = 0; i < players.length; i++) {
            entryCount[players[i]] = 0;
        }
    }

    function changeEntryCost(uint256 _newEntryCost) external onlyOwner {
        require(!raffleStatus, "Cant be changed when raffle is running");
        entryCost = _newEntryCost;
        emit EntryCostChanged(_newEntryCost);
    }

    function withdrawBalance() external onlyOwner {
        require(address(this).balance > 0, "No Balance to withdraw");

        payable(owner).transfer(address(this).balance);
        emit BalanceWithdrawn(address(this).balance);
    }

    function getPlayer() public view returns (address[] memory) {
        return players;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function resetContract() external onlyOwner {
        //in case something goes wrong
        delete playerSelector;
        delete players;
        raffleStatus = false;
        nftAddress = address(0);
        nftId = 0;
        entryCost = 0;
        totalEntries = 0;
        resetEntryCount();
    }
}
