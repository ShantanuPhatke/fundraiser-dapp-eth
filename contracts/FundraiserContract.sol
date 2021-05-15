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
    
    function getFundraiserGoal(Fundraiser _fundraiserId) view public returns(uint) {
        for(uint i=0; i<fundraisers.length; i++) {
            if(_fundraiserId == fundraisers[i]) {
                Fundraiser _fundraiser = Fundraiser(fundraisers[i]);
                return _fundraiser.getGoal();
            }
        }
        return 0;
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
    
    // 10000, 100, 16191360000, 'shanHost',  'Test Fundraiser', 'This is a test fundraiser for my first test', 0xf33ae10487660103e12db21283374afa18a556dc
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
    
    function getDetails() view public returns (uint _goalAmount, string memory _hostName, string memory _title, string memory _description, address _fundraiserAddress) {
        return (goalAmount, hostName, title, description, address(this));
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
    
    
    function addDonation() public payable {
        if(msg.value < minDonation) {
            revert();
        } else {
            if(donators[msg.sender] == 0){
                donators[msg.sender] += msg.value;
                donatorsAddress[donatorCount++] = msg.sender;    
            } else {
                donators[msg.sender] += msg.value;
            }
        }
    }
    
    
    function refundAll() public payable {
        for(uint i=1; i <= donatorCount; i++) {
            address _to = donatorsAddress[i];
            uint _amount = donators[_to];
            payable(_to).transfer(_amount);
        }
    }
    
    function releaseFunds() public payable {
        payable(recipientAddress).transfer(goalAmount);
    }
    
    
}