var SimpleVoting;

var voterRegisteredEvent;
var proposalsRegistrationStartedEvent;
var proposalsRegistrationEndedEvent;
var proposalRegisteredEvent;
var votingSessionStartedEvent;
var votingSessionEndedEvent;
var votedEvent;
var votesTalliedEvent;
var workflowStatusChangeEvent;

window.onload = function() {
	$.getJSON("./contracts/SimpleVoting.json", function(json) {
	    SimpleVoting = TruffleContract( json );
	    
		SimpleVoting.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
		
		SimpleVoting.deployed()
		.then(instance => instance.VoterRegisteredEvent())
		.then(voterRegisteredEventSubscription => {
		    voterRegisteredEvent = voterRegisteredEventSubscription;	

		    voterRegisteredEvent.watch(function(error, result) {
			  if (!error)
				$("#voterRegistrationMessage").html('<h6>Voter successfully registered</h6>');
			  else
				console.log(error);
		    });			  
	    });
		
		SimpleVoting.deployed()
		.then(instance => instance.ProposalsRegistrationStartedEvent())
		.then(proposalsRegistrationStartedEventSubscription => {
		    proposalsRegistrationStartedEvent = proposalsRegistrationStartedEventSubscription;	

		    proposalsRegistrationStartedEvent.watch(function(error, result) {
			  if (!error)
				$("#proposalsRegistrationMessage").html('<h6>The proposals registration session has started</h6>');
			  else
				console.log(error);
		    });			  
	    });	

		SimpleVoting.deployed()
		.then(instance => instance.ProposalsRegistrationEndedEvent())
		.then(proposalsRegistrationEndedEventSubscription => {
		    proposalsRegistrationEndedEvent = proposalsRegistrationEndedEventSubscription;	

		    proposalsRegistrationEndedEvent.watch(function(error, result) {
			  if (!error)
				$("#proposalsRegistrationMessage").html('<h6>The proposals registration session has ended</h6>');
			  else
				console.log(error);
		    });			  
	    });			
		
		SimpleVoting.deployed()
		.then(instance => instance.ProposalRegisteredEvent())
		.then(proposalRegisteredEventSubscription => {
		    proposalRegisteredEvent = proposalRegisteredEventSubscription;	

		    proposalRegisteredEvent.watch(function(error, result) {
			  if (!error)
			  {
				$("#proposalRegistrationMessage").html('<h6>The proposal has been registered successfully</h6>');
				loadProposalsTable();
			  }
			  else
				console.log(error);
		    });			  
	    });	

		SimpleVoting.deployed()
		.then(instance => instance.VotingSessionStartedEvent())
		.then(votingSessionStartedEventSubscription => {
		    votingSessionStartedEvent = votingSessionStartedEventSubscription;	

		    votingSessionStartedEvent.watch(function(error, result) {
			  if (!error)
				$("#votingSessionMessage").html('<h6>The voting session session has started</h6>');
			  else
				console.log(error);
		    });			  
	    });	
		
		SimpleVoting.deployed()
		.then(instance => instance.VotingSessionEndedEvent())
		.then(votingSessionEndedEventSubscription => {
		    votingSessionEndedEvent = votingSessionEndedEventSubscription;	

		    votingSessionEndedEvent.watch(function(error, result) {
			  if (!error)
				$("#votingSessionMessage").html('<h6>The voting session session has ended</h6>');
			  else
				console.log(error);
		    });			  
	    });		

		SimpleVoting.deployed()
		.then(instance => instance.VotedEvent())
		.then(votedEventSubscription => {
		    votedEvent = votedEventSubscription;	

		    votedEvent.watch(function(error, result) {
			  if (!error)
				$("#voteConfirmationMessage").html('<h6>You have voted successfully</h6>');
			  else
				console.log(error);
		    });			  
	    });		

		SimpleVoting.deployed()
		.then(instance => instance.VotesTalliedEvent())
		.then(votesTalliedEventSubscription => {
		    votesTalliedEvent = votesTalliedEventSubscription;	

		    votesTalliedEvent.watch(function(error, result) {
			  if (!error)
		      {
			     $("#votingTallyingMessage").html('<h6>Votes have been tallied</h6>');
			     loadResultsTable();
		      }
			  else
				console.log(error);
		    });			  
	    });			
		
	    SimpleVoting.deployed()
		.then(instance => instance.WorkflowStatusChangeEvent())
		.then(workflowStatusChangeEventSubscription => {
		    workflowStatusChangeEvent = workflowStatusChangeEventSubscription;	

		    workflowStatusChangeEvent.watch(function(error, result) {
			  if (!error)
				refreshWorkflowStatus();
			  else
				console.log(error);
		    });			  
	    });		
	   
	    refreshWorkflowStatus();
	});
}

function refreshWorkflowStatus()
{		
	SimpleVoting.deployed()
	.then(instance => instance.getWorkflowStatus())
	.then(workflowStatus => {
		var workflowStatusDescription;
		
		switch(workflowStatus.toString())
		{
			case '0':
				workflowStatusDescription = "<h4><b>Registering Voters</b></h4> ";		
				break;
			case '1':
				workflowStatusDescription = "<h4><b>Candidates registration Started</b></h4>";
				break;
			case '2':
				workflowStatusDescription = "<h4><b>Candidates registration Ended</b></h4>";
				break;
			case '3':
				workflowStatusDescription = "<h4><b>Voting session Started</b></h4>";
				break;
			case '4':
				workflowStatusDescription = "<h4><b>Voting session Ended</b></h4>";
				break;
			case '5':
				workflowStatusDescription = "<h4><b>Votes have been tallied</b></h4>";
				break;	
			default:
				workflowStatusDescription = "<h4><b>Unknown status</b></h4>";
		}
				
		$("#currentWorkflowStatusMessage").html(workflowStatusDescription);
	});
}	

function unlockAdmin()
{
	$("#adminMessage").html('');
	
	var adminAddress = $("#adminAddress").val();
	var adminPassword = $("#adminPassword").val();

	var result = web3.personal.unlockAccount(adminAddress, adminPassword, 180);//unlock for 3 minutes
	if (result)
		$("#adminMessage").html('<h6>The account has been unlocked</h6>');
	else
		$("#adminMessage").html('<h6>The account has NOT been unlocked</h6>');
}

function unlockVoter()
{
	$("#voterMessage").html('');
	
	var voterAddress = $("#voterAddress").val();
	var voterPassword = $("#voterPassword").val();

	var result = web3.personal.unlockAccount(voterAddress, voterPassword, 180);//unlock for 3 minutes
	if (result)
		$("#voterMessage").html('<h6>The account has been unlocked</h6>');
	else
		$("#voterMessage").html('<h6>The account has NOT been unlocked</h6>');
}

function registerVoter() {
	
	$("#voterRegistrationMessage").html('');
	
	var adminAddress = $("#adminAddress").val();
	var voterToRegister = $("#voterAddress").val();
	
	SimpleVoting.deployed()
	.then(instance => instance.isAdministrator(adminAddress))
	.then(isAdministrator =>  {		
		if (isAdministrator)
		{
			return SimpleVoting.deployed()
				.then(instance => instance.isRegisteredVoter(voterToRegister))
				.then(isRegisteredVoter => {
					if (isRegisteredVoter)
						$("#voterRegistrationMessage").html('<h6>The voter is already registered</h6>');					    
					else
					{
						return SimpleVoting.deployed()
							.then(instance => instance.getWorkflowStatus())
							.then(workflowStatus => {
								if (workflowStatus > 0)
									$("#voterRegistrationMessage").html('<h6>Voters registration has already ended</h6>');					    
								else
								{
									SimpleVoting.deployed()
									   .then(instance => instance.registerVoter(voterToRegister, {from:adminAddress, gas:200000}))
									   .catch(e => $("#voterRegistrationMessage").html(e));
								}
							});
					}
				});
		}
		else
		{
			$("#voterRegistrationMessage").html('<h6>The given address does not correspond to the administrator</h6>');
		}
	});
}

function checkVoterRegistration() {
	
	$("#registrationVerificationMessage").html('');
	
	var address = $("#address").val();	
	
	SimpleVoting.deployed()
	.then(instance => instance.isRegisteredVoter(address))
	.then(isRegisteredVoter =>  {
		if (isRegisteredVoter)
				$("#registrationVerificationMessage").html('<h6>This is a registered voter</h6>');
			 else
				$("#registrationVerificationMessage").html('<h6>This is NOT a registered voter</h6>');
	});
}

function startProposalsRegistration() {
	
	$("#proposalsRegistrationMessage").html('');
	
	var adminAddress = $("#adminAddress").val();
	
	SimpleVoting.deployed()
	.then(instance => instance.isAdministrator(adminAddress))
	.then(isAdministrator =>  {		
		if (isAdministrator)
		{
			return SimpleVoting.deployed()
				.then(instance => instance.getWorkflowStatus())
				.then(workflowStatus => {
					if (workflowStatus > 0)
						$("#proposalsRegistrationMessage").html('<h6>The candidates registration session has already been started</h6>');					    
					else
					{
						SimpleVoting.deployed()
						   .then(instance => instance.startProposalsRegistration({from:adminAddress, gas:200000}))
						   .catch(e => $("#proposalsRegistrationMessage").html(e));
					}
				});
		}
		else
		{
			$("#proposalsRegistrationMessage").html('<h6>The given address does not correspond to the administrator</h6>');
		}
	});	
}

function endProposalsRegistration() {
	
	$("#proposalsRegistrationMessage").html('');
	
	var adminAddress = $("#adminAddress").val();
	
	SimpleVoting.deployed()
	.then(instance => instance.isAdministrator(adminAddress))
	.then(isAdministrator =>  {		
		if (isAdministrator)
		{
			return SimpleVoting.deployed()
				.then(instance => instance.getWorkflowStatus())
				.then(workflowStatus => {
					if (workflowStatus < 1)
						$("#proposalsRegistrationMessage").html('<h6>The candidate registration session has not started yet</h6>');
					else if (workflowStatus > 1)
						$("#proposalsRegistrationMessage").html('<h6>The candidate registration session has already been ended</h6>');				    
					else
					{
						SimpleVoting.deployed()
						   .then(instance => instance.endProposalsRegistration({from:adminAddress, gas:200000}))
						   .catch(e => $("#proposalsRegistrationMessage").html(e));
					}
				});
		}
		else
		{
			$("#proposalsRegistrationMessage").html('<h6>The given address does not correspond to the administrator</h6>');
		}
	});	
}

function startVotingSession() {
	
	$("#votingSessionMessage").html('');	
	
	var adminAddress = $("#adminAddress").val();
	
	SimpleVoting.deployed()
	.then(instance => instance.isAdministrator(adminAddress))
	.then(isAdministrator =>  {		
		if (isAdministrator)
		{
			return SimpleVoting.deployed()
				.then(instance => instance.getWorkflowStatus())
				.then(workflowStatus => {
					if (workflowStatus < 2)
						$("#votingSessionMessage").html('<h6>The candidate registration session has not ended yet</h6>');
					else if (workflowStatus > 2)
						$("#votingSessionMessage").html('<h6>The voting session has already been started</h6>');					    
					else
					{
						SimpleVoting.deployed()
						   .then(instance => instance.startVotingSession({from:adminAddress, gas:200000}))
						   .catch(e => $("#votingSessionMessage").html(e));
					}
				});
		}
		else
		{
			$("#votingSessionMessage").html('<h6>The given address does not correspond to the administrator</h6>');
		}
	});		
}

function endVotingSession() {
	
	$("#votingSessionMessage").html('');
	
	var adminAddress = $("#adminAddress").val();
	
	SimpleVoting.deployed()
	.then(instance => instance.isAdministrator(adminAddress))
	.then(isAdministrator =>  {		
		if (isAdministrator)
		{
			return SimpleVoting.deployed()
				.then(instance => instance.getWorkflowStatus())
				.then(workflowStatus => {
					if (workflowStatus < 3)
						$("#votingSessionMessage").html('<h6>The voting session has not started yet</h6>');
					else if (workflowStatus > 3)
						$("#votingSessionMessage").html('<h6>The voting session has already ended</h6>');					    
					else
					{
						SimpleVoting.deployed()
						   .then(instance => instance.endVotingSession({from:adminAddress, gas:200000}))
						   .catch(e => $("#votingSessionMessage").html(e));
					}
				});
		}
		else
		{
			$("#votingSessionMessage").html('<h6>The given address does not correspond to the administrator</h6>');
		}
	});
}

function tallyVotes() {
	
	$("#votingTallyingMessage").html('');
	
	var adminAddress = $("#adminAddress").val();
	
	SimpleVoting.deployed()
	.then(instance => instance.isAdministrator(adminAddress))
	.then(isAdministrator =>  {		
		if (isAdministrator)
		{
			return SimpleVoting.deployed()
				.then(instance => instance.getWorkflowStatus())
				.then(workflowStatus => {
					if (workflowStatus < 4)
						$("#votingTallyingMessage").html('<h6>The voting session has not ended yet</h6>');		
					else if (workflowStatus > 4)
						$("#votingTallyingMessage").html('<h6>Votes have already been tallied</h6>');				    
					else
					{
						SimpleVoting.deployed()
						   .then(instance => instance.tallyVotes({from:adminAddress, gas:200000}))
						   .catch(e => $("#votingTallyingMessage").html(e));
					}
				});
		}
		else
		{
			$("#votingTallyingMessage").html('<h6>The given address does not correspond to the administrator</h6>');
		}
	});	
}

function registerProposal() {
	
	$("#proposalRegistrationMessage").html('');
	
	var voterAddress = $("#voterAddress").val();
	var proposalDescription = $("#proposalDescription").val();
	
	SimpleVoting.deployed()
	.then(instance => instance.isRegisteredVoter(voterAddress))
	.then(isRegisteredVoter =>  {		
		if (isRegisteredVoter)
		{
			return SimpleVoting.deployed()
				.then(instance => instance.getWorkflowStatus())
				.then(workflowStatus => {
					if (workflowStatus < 1)
						$("#proposalRegistrationMessage").html('<h6>The candidate registration session has not started yet</h6>');
					else if (workflowStatus > 1)
						$("#proposalRegistrationMessage").html('<h6>The candidate registration session has already ended</h6>');				    
					else
					{
						SimpleVoting.deployed()
						   .then(instance => instance.registerProposal(proposalDescription, {from:voterAddress, gas:200000}))
						   .catch(e => $("#proposalRegistrationMessage").html(e));
					}
				});
		}
		else
		{
			$("#proposalRegistrationMessage").html('<h6>You are not a registered voter.</h6>');
		}
	});			
}


function loadProposalsTable() {
	
	SimpleVoting.deployed()
	.then(instance => instance.getProposalsNumber())
	.then(proposalsNumber => {
		
		var innerHtml = "<tr cellpadding='5px' align='center'><th><h4>Candidate Id</h4></th>&nbsp<th><h4>Name</h4></th></tr>";
		
		j = 0;
		for (var i = 0; i < proposalsNumber; i++) {
			getProposalDescription(i)
			.then(description => {
				innerHtml = innerHtml + "<tr align='center' cellpadding='5px'><td><b>" + (j++) + "</b></td><td><b>" + description + "</b></td></tr>";
				$("#proposalsTable").html(innerHtml);
			});
		}
    });		
}

function getProposalDescription(proposalId)
{
    return SimpleVoting.deployed()
	  .then(instance => instance.getProposalDescription(proposalId));
}

function vote() {
	$("#voteConfirmationMessage").html('');
	
	var voterAddress = $("#voterAddress").val();
	var proposalId = $("#proposalId").val();
	
	SimpleVoting.deployed()
	.then(instance => instance.isRegisteredVoter(voterAddress))
	.then(isRegisteredVoter =>  {		
		if (isRegisteredVoter)
		{
			return SimpleVoting.deployed()
				.then(instance => instance.getWorkflowStatus())
				.then(workflowStatus => {
					if (workflowStatus < 3)
						$("#voteConfirmationMessage").html('<h6>The voting session has not started yet</h6>');
					else if (workflowStatus > 3)
						$("#voteConfirmationMessage").html('<h6>The voting session has already ended</h6>');				    
					else
					{
						SimpleVoting.deployed()
							.then(instance => instance.getProposalsNumber())
							.then(proposalsNumber => {
								if (proposalsNumber == 0)
								{
									$("#voteConfirmationMessage").html('<h6>There are no registered candidate. You cannot vote.</h6>');
								}
								else if (parseInt(proposalId) >= proposalsNumber)
								{
									$("#voteConfirmationMessage").html('<h6>The specified candidate Id does not exist.</h6>');
								}							
								else 
								{
									SimpleVoting.deployed()
									   .then(instance => instance.vote(proposalId, {from:voterAddress, gas:200000}))
									   .catch(e => $("#voteConfirmationMessage").html(e));
								}
							});
					}
				});
		}
		else
		{
			$("#proposalRegistrationMessage").html('<h6>You are not a registered voter.</h6>');
		}
	});					
}

function loadResultsTable() {

	SimpleVoting.deployed()
		.then(instance => instance.getWorkflowStatus())
		.then(workflowStatus => {
			if (workflowStatus == 5)
			{
				var innerHtml = "<tr><th><b>Winning Candidate</b></th></tr>";
				
				SimpleVoting.deployed()
				   .then(instance => instance.getWinningProposalId())
				   .then(winningProposalId => {
					   innerHtml = innerHtml + "<tr><td><b>Id:</b></td><td><b>" + winningProposalId +"</b></td></tr>";
					   
					   SimpleVoting.deployed()
				       .then(instance => instance.getWinningProposalDescription())
					   .then(winningProposalDescription => {
						   innerHtml = innerHtml +  "<tr><td><b>Name:</b></td><td><b>" + winningProposalDescription  +"</b></td></tr>";
						    
						   SimpleVoting.deployed()
				           .then(instance => instance.getWinningProposaVoteCounts())
					       .then(winningProposalVoteCounts => {
						           innerHtml = innerHtml +  "<tr><td><b>Votes count:</b></td><td><b>" + winningProposalVoteCounts  +"</b></td></tr>";
								   
								   $("#resultsTable").html(innerHtml);
						   });
					   });
				   });
			}
		});
}