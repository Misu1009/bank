// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract Bank{
    address private owner_address;
    string public owner_name;

    constructor(string memory name) {
        owner_address = msg.sender;
        owner_name = name;
    }

    address[] private customer_list;

    enum Status{DEPOSIT, RECEIVE, TRANSFER, WITHDRAW, ACCOUNT_CREATED}

    struct Transaction_history{
        uint date;
        Status status;
    }
    struct Customer_data{
        string name;
        uint balance;
        bool active;   
    }

    mapping(address => Customer_data) customer;
    mapping(address => Transaction_history[]) history;

    // is customer exist or not
    modifier exist(address alamat){
        require(customer[alamat].active && addressExists(alamat), "CUSTOMER DOESN'T EXIST");
        _;
    }

    modifier ownership(){
        require(msg.sender == owner_address, "YOU ARE NOT AN OWNER OF THIS BANK");
        _;
    }

    modifier customer_exist(){
        require(customer_list.length != 0, "There are no customer");
        _;
    } 

    function addressExists(address alamat) private view returns(bool) {
        for(uint i=0; i<customer_list.length; i++) {
            if(customer_list[i] == alamat) {
                return true;
            }
        }
        return false;
    }

    function get_customer_total() public view ownership() returns(uint){
        return customer_list.length;
    }

    //
    function check_all_customer() public view ownership() customer_exist() returns(string[] memory) {
        string[] memory list_of_customer = new string[](customer_list.length);
        uint count = 0;

        for(uint i=0; i<customer_list.length; i++) {
            if(customer[customer_list[i]].active) {
                list_of_customer[count] = string.concat(
                    "No. ", Strings.toString(count+1),
                    " -> ", customer[customer_list[i]].name,
                    ", ", Strings.toString(customer[customer_list[i]].balance)
                );
                count++;
            }
        }

        return list_of_customer;
    }

    // register new customer
    function register_customer(string memory name)public {
        require(!customer[msg.sender].active, "CUSTOMER ALREADY REGISTERED");

        customer[msg.sender] = Customer_data(name, 0, true);
        history[msg.sender].push(Transaction_history(block.timestamp, Status.ACCOUNT_CREATED));

        customer_list.push(msg.sender);
    }

    // deposit
    function deposit()public payable exist(msg.sender){
        customer[msg.sender].balance += msg.value;

        history[msg.sender].push(Transaction_history(block.timestamp, Status.DEPOSIT));
    }

    // transfer to another account
    function transfer(address target_address, uint amount) 
                public payable exist(msg.sender) exist(target_address){
        
        require(amount <= customer[msg.sender].balance, "BALANCE ISN'T ENOUGH");

        customer[msg.sender].balance -= amount;
        customer[target_address].balance += amount;

        history[msg.sender].push(Transaction_history(block.timestamp, Status.TRANSFER));
        history[target_address].push(Transaction_history(block.timestamp, Status.RECEIVE));
    }

    // check customer data
    function check_data()public view returns(string memory, uint){
        return (customer[msg.sender].name, customer[msg.sender].balance);
    }

    function check_history() public view returns(string[] memory){
        string[] memory list_of_history = new string[](history[msg.sender].length);
        for(uint i=0; i<history[msg.sender].length; i++){
            list_of_history[i] = 
                string.concat
                    (
                    "No. ", Strings.toString(i+1), 
                    " -> ", Strings.toString(history[msg.sender][i].date),
                     ", ", status_to_string(history[msg.sender][i].status)
                );
        }

        return list_of_history;
    }

    // withdraw
    function withdraw(uint amount)public exist(msg.sender){
        require(amount <= customer[msg.sender].balance, "INSUFFICIENT BALANCE");
        // Effects: Kurangi saldo pelanggan
        customer[msg.sender].balance -= amount;
        // Interactions: Kirim uang ke pelanggan
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "TRANSFER FAILED");
        // Catat transaksi
        history[msg.sender].push(Transaction_history(block.timestamp, Status.WITHDRAW));
    }

    function status_to_string(Status status) private pure returns(string memory){
        if(status == Status.ACCOUNT_CREATED) return "Account Created";
        if(status == Status.DEPOSIT) return "Deposit";
        if(status == Status.RECEIVE) return "Receive";
        if(status == Status.TRANSFER) return "Transfer";
        if(status == Status.WITHDRAW) return "Withdraw";
        return "Unknown Status";
    }
}