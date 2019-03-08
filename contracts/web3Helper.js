const Web3 = require('web3');
const web3 = new Web3('ws://localhost:7545');
const contractv2 = require('./contractv2');

//Create an Ethereum account
async function createEthAccount(callback){
	var account = await web3.eth.personal.newAccount(web3.utils.randomHex(32));
	callback(account);
}

//Deploy the contract
async function deploy(data, callback){
    var accounts = await web3.eth.getAccounts();
	
    //data = {id: '634656457', name: 'Bhavana', degree: 'Btech', clg: 'TKR', score: '80', batch:'2020', issueDate: '20-10-2019'};
    

    var contract = await new web3.eth.Contract(contractv2.abi)
        .deploy({data: contractv2.byteCode, arguments: [data.id, data.name, data.degree, data.clg, data.score, data.batch, data.issueDate, data.sign]})
		.send({ gas: '5000000', from: accounts[1] });
	console.log('Contract deployed to: ', contract.options.address);
	callback(contract.options.address);
	console.log("DEPLOY: ", await contract.methods.getName().call());
}

//Get a deployed contract
async function getDeployedContract(address, callback){
	try{
		var contract = await new web3.eth.Contract(contractv2.abi, address);
		var name = await contract.methods.getName().call();
		var degree = await contract.methods.getDegree().call();
		var college = await contract.methods.getCollege().call();
		var score = await contract.methods.getScore().call();
		var batch = await contract.methods.getBatch().call();
        var sign = await contract.methods.getSign().call();
        var issueDate = await contract.methods.getIssueDate().call();
        var validity = await contract.methods.getValidity().call();
		var data = {name: name, degree: degree, college: college, score: score, batch: batch, sign: sign, issueDate: issueDate, validity: validity};
        console.log(data);
        callback(data);
	}
	catch(e){
		console.log(e);
		callback();
	}
	
	console.log("FIND: ", data);
}

async function getValidity(address, callback){
    try{
        var contract = await new web3.eth.Contract(contractv2.abi, address);
        var validity = await contract.methods.getValidity().call();
        callback(validity);
    }
    catch(e){
        callback();
        console.log(e);
    }
}

async function setUserAddress(address, account, callback){
    var contract= await new web3.eth.Contract(contractv2.abi, address);
    var accounts = await web3.eth.getAccounts();
    try{
        var val = await contract.methods.userSigning().send({from: accounts[5], gas: 3000000});
        callback(val)
    }
    catch(e){
        console.log(e);
        callback();
    }
}

async function revoke(address, account, callback){
    var contract= await new web3.eth.Contract(contractv2.abi, address);
    var accounts = await web3.eth.getAccounts();
    try{
        val=await contract.methods.revokeReq().send({from: accounts[account], gas: 3000000});
        callback();
    }
    catch(e){
        console.log(e);
    }
}

module.exports = {deploy: deploy, getDeployedContract: getDeployedContract, setUserAddress: setUserAddress, revoke: revoke, getValidity: getValidity};

