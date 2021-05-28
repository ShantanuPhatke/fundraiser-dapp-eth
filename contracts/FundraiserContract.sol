// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract FundraiserStore {
    Fundraiser[] public fundraisers;
    
    function createFundraiser(uint _goalAmount, uint _minDonation, uint256 _expiryDate, string memory _hostName, string memory _title, string memory _description, address _recipientAddress) public {
        address hostAddress = msg.sender;
        Fundraiser _fundraiser = new Fundraiser(_goalAmount, _minDonation, _expiryDate, _hostName, _title, _description, _recipientAddress, hostAddress);
        fundraisers.push(_fundraiser);
    }
    
    function getAll() view public returns(Fundraiser[] memory) {
        return fundraisers;
    }
    
}

contract Fundraiser {
    uint fundraiserId = 1;
    uint goalAmount;
    uint minDonation;
    uint donatorCount = 1;
    uint256 expiryDate;
    bool isCompleted;
    string title;
    string description;    
    string hostName;
    address hostAddress;
    address recipientAddress;
    mapping(address => uint) donators;
    mapping(uint => address) donatorsAddress;
    enum Stage {Donation, Complete, Expired}
    Stage public stage = Stage.Donation;
    
    // 10000, 100, 1653067368, 'shanHost',  'Test Fundraiser', 'This is a test fundraiser for my first test', 0xdD870fA1b7C4700F2BD7f44238821C26f7392148
    constructor(uint _goalAmount, uint _minDonation, uint256 _expiryDate, string memory _hostName, string memory _title, string memory _description, address _recipientAddress, address _hostAddress) {
        fundraiserId++;
        goalAmount = _goalAmount;
        minDonation = _minDonation;
        expiryDate = _expiryDate;
        isCompleted = false;
        title = _title;
        description = _description;
        hostName = _hostName;
        hostAddress = _hostAddress;
        recipientAddress = _recipientAddress;
    }
    
    modifier onlyHost{
        require(msg.sender == hostAddress);
        _;
    }
    
    modifier validStage(Stage reqStage){
        require(stage == reqStage);
        _;
    }
    
    modifier minDonate{
        require(msg.value >= minDonation);
        _;
    }
    
    function isFundraiserExpired() view public returns(bool) {
        if(block.timestamp > expiryDate){
            return true;
        } else {
            return false;
        }
    }
    
    function getDetails() public payable returns (uint _goalAmount, string memory _hostName, string memory _title, string memory _description, address _fundraiserAddress, uint _fundraiserBalance, uint _stage) {
        bool isExpired = isFundraiserExpired();
        if(isExpired) {
            stage = Stage.Expired;
            refundAll();
        }
        return (goalAmount, hostName, title, description, address(this), address(this).balance, uint(stage));
    }
    
    function getAllDetails() view public returns (uint _goalAmount, uint _minDonation, uint _donatorCount, uint256 _expiryDate, bool _isCompleted, string memory _hostName, string memory _title, string memory _description, address _hostAddress, address _recipientAddress, address _fundraiserAddress, uint _fundraiserBalance) {
        return (goalAmount, minDonation, donatorCount, expiryDate, isCompleted, hostName, title, description, hostAddress, recipientAddress, address(this), address(this).balance);
    }
    
    function getGoal() view public returns (uint) {
        return goalAmount;
    }
    
    function getBalance() view public returns (uint) {
        return address(this).balance;
    }
    
    function getStatus() view public returns (Stage) {
        return stage;
    }
    
    
    function addDonation() public payable validStage(Stage.Donation) minDonate {
        if(block.timestamp > expiryDate){
            revert();
        } else {
            if(donators[msg.sender] == 0){
                donators[msg.sender] += msg.value;
                donatorsAddress[donatorCount++] = msg.sender;    
            } else {
                donators[msg.sender] += msg.value;
            }
            //change state if goal is completed. this.balance already adds the msg.value
            if(address(this).balance >= goalAmount){
                stage = Stage.Complete;
                isCompleted = true;
                releaseFunds();
            }
        }
    }
    
    function refundAll() public payable validStage(Stage.Expired) {
        for(uint i=1; i <= donatorCount; i++) {
            address _to = donatorsAddress[i];
            uint _amount = donators[_to];
            payable(_to).transfer(_amount);
        }
    }
    
    function releaseFunds() public payable validStage(Stage.Complete) { 
        payable(recipientAddress).transfer(goalAmount);
    }
    
    
}